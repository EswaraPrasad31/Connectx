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
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.user.profileImage} alt={`${post.user.username}'s profile`} />
          <AvatarFallback>{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <span className="font-semibold text-sm">{post.user.username}</span>
        </div>
        <button className="ml-auto text-gray-500 dark:text-gray-400">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      {/* Post Image */}
      <div className="aspect-w-4 aspect-h-5 bg-gray-100 dark:bg-gray-900">
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center">
          <button 
            className={`text-2xl mr-4 transition-colors ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className="h-6 w-6" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="text-2xl mr-4">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="text-2xl">
            <Send className="h-6 w-6" />
          </button>
          <button className="ml-auto text-2xl">
            <Bookmark className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-2">
          <p className="font-semibold text-sm">{likesCount} likes</p>
          <p className="mt-1 text-sm">
            <span className="font-semibold">{post.user.username}</span> {' '}
            <span>{post.caption}</span>
          </p>
          {post.commentCount > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View all {post.commentCount} comments</p>
          )}
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{timeAgo}</p>
        </div>
      </div>
      
      {/* Comment Input */}
      <form 
        onSubmit={handleComment}
        className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center"
      >
        <button type="button" className="text-xl mr-3">
          <Smile className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <Input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          className="ml-3 text-primary font-semibold text-sm"
          disabled={!comment.trim() || commentMutation.isPending}
        >
          Post
        </Button>
      </form>
    </article>
  );
}
