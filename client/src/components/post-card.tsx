import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PostCardProps = {
  post: {
    id: number;
    imageUrl: string;
    caption: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    user: {
      id: number;
      username: string;
      profileImage: string;
    };
  };
};

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likeCount);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  // Format time ago string
  const timeAgo = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt), { addSuffix: false }).toUpperCase() : 
    'RECENTLY';

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/posts/${post.id}/like`, {});
      return res.json();
    },
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/posts/${post.id}/comment`, { content: comment });
      return res.json();
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const handleLike = () => {
    if (!user) return;
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    commentMutation.mutate();
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300 border border-gray-100 dark:border-gray-700">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20 border-2 border-white dark:border-gray-900">
          <AvatarImage src={post.user.profileImage} alt={`${post.user.username}'s profile`} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-bold">{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <span className="font-bold text-sm hover:text-primary transition-colors cursor-pointer">{post.user.username}</span>
          <p className="text-xs text-gray-500 dark:text-gray-400">Original poster</p>
        </div>
        <button className="ml-auto text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      {/* Post Image */}
      <div className="aspect-w-4 aspect-h-5 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center">
          <button 
            className={`mr-4 transition-transform hover:scale-110 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className="h-7 w-7" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="mr-4 transition-transform hover:scale-110">
            <MessageCircle className="h-7 w-7" />
          </button>
          <button className="transition-transform hover:scale-110">
            <Send className="h-7 w-7" />
          </button>
          <button className="ml-auto transition-transform hover:scale-110">
            <Bookmark className="h-7 w-7" />
          </button>
        </div>
        
        <div className="mt-3">
          <p className="font-bold text-sm">{likesCount.toLocaleString()} likes</p>
          <p className="mt-2 text-sm leading-snug">
            <span className="font-bold hover:text-primary transition-colors cursor-pointer">{post.user.username}</span>{' '}
            <span className="text-gray-900 dark:text-gray-200">{post.caption}</span>
          </p>
          {post.commentCount > 0 && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              View all {post.commentCount} comments
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">{timeAgo}</p>
        </div>
      </div>
      
      {/* Comment Input */}
      <form 
        onSubmit={handleComment}
        className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center"
      >
        <button type="button" className="mr-3 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
          <Smile className="h-6 w-6" />
        </button>
        <Input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          className="ml-3 text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
          disabled={!comment.trim() || commentMutation.isPending}
        >
          Post
        </Button>
      </form>
    </article>
  );
}
