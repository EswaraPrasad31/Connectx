import { useState, useRef } from 'react';
import { X, Image, Upload } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server/CDN
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      // In a real app, this would upload the image and then create the post
      // For now, we'll simulate the API call
      const res = await apiRequest('POST', '/api/posts', { 
        imageUrl: selectedImage || 'https://source.unsplash.com/random/800x1000',
        caption 
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Post created',
        description: 'Your post has been published successfully!',
      });
      setSelectedImage(null);
      setCaption('');
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  });

  const handleSubmit = () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please select an image to post.',
        variant: 'destructive',
      });
      return;
    }
    
    createPostMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {selectedImage ? (
            <div className="space-y-4">
              <div className="aspect-w-4 aspect-h-5 bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Post preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Textarea
                placeholder="Write a caption..."
                className="w-full resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Change Image
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? 'Posting...' : 'Share'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Image className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg mb-4">Drag photos and videos here</p>
              <Button onClick={openFileSelector}>
                <Upload className="h-4 w-4 mr-2" />
                Select from computer
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
