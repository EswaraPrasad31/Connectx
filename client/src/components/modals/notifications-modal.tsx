import React, { useState } from 'react';
import { X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Sample notification data with Indian names
const notificationsData = [
  {
    id: 1,
    username: "jaideep",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    action: "liked your photo",
    timeAgo: "2h"
  },
  {
    id: 2,
    username: "shiva",
    profileImage: "https://randomuser.me/api/portraits/men/43.jpg",
    action: "started following you",
    timeAgo: "1d",
    showFollowButton: true
  },
  {
    id: 3,
    username: "abhiram",
    profileImage: "https://randomuser.me/api/portraits/men/64.jpg",
    action: "mentioned you in a comment",
    timeAgo: "3d"
  },
  {
    id: 4,
    username: "sarfraz",
    profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
    action: "liked your story",
    timeAgo: "4d"
  },
  {
    id: 5,
    username: "maharshith",
    profileImage: "https://randomuser.me/api/portraits/men/86.jpg",
    action: "commented on your post",
    timeAgo: "5d"
  }
];

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  // Add state to track followed users
  const [followed, setFollowed] = useState<Record<number, boolean>>({});
  
  const handleFollow = (id: number) => {
    setFollowed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {notificationsData.map(notification => (
              <div key={notification.id} className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.profileImage} alt={`${notification.username}'s profile`} />
                  <AvatarFallback>{notification.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.username}</span> {notification.action}.{' '}
                    <span className="text-gray-400 text-xs">{notification.timeAgo}</span>
                  </p>
                </div>
                {notification.showFollowButton && (
                  <Button 
                    size="sm" 
                    className={`${followed[notification.id] 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                      : 'bg-[#00D166] hover:bg-opacity-90 text-white'} 
                      text-sm font-semibold py-1.5 px-3 rounded transition-colors`}
                    onClick={() => handleFollow(notification.id)}
                  >
                    {followed[notification.id] ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
