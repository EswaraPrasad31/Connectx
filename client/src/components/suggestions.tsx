import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@shared/schema';

type SuggestionsProps = {
  user: Omit<User, 'password'>;
};

// Sample suggestion data with Indian names
const suggestionsData = [
  {
    id: 1,
    username: "arjun_dev",
    fullName: "Arjun Sharma",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    reason: "New to ConnectX"
  },
  {
    id: 2,
    username: "priya_designs",
    fullName: "Priya Patel",
    profileImage: "https://randomuser.me/api/portraits/women/33.jpg",
    reason: "Follows you"
  },
  {
    id: 3,
    username: "vikram_tech",
    fullName: "Vikram Singh",
    profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
    reason: "Suggested for you"
  },
  {
    id: 4,
    username: "neha_photo",
    fullName: "Neha Gupta",
    profileImage: "https://randomuser.me/api/portraits/women/55.jpg",
    reason: "Followed by jaideep"
  }
];

export default function Suggestions({ user }: SuggestionsProps) {
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  
  const handleFollow = (id: number) => {
    if (followedUsers.includes(id)) {
      setFollowedUsers(followedUsers.filter(userId => userId !== id));
    } else {
      setFollowedUsers([...followedUsers, id]);
    }
  };
  
  return (
    <aside className="hidden lg:block w-80 p-8 fixed right-0 top-0 h-full overflow-y-auto border-l border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
      {/* User Profile */}
      <div className="flex items-center mb-8">
        <Avatar className="h-14 w-14 ring-2 ring-primary/20 border-2 border-white dark:border-gray-900">
          <AvatarImage src={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"} alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-white font-bold">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-bold text-sm">{user.username}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{user.fullName || "Your Name"}</p>
        </div>
        <button className="ml-auto text-primary hover:text-primary/80 transition-colors text-xs font-semibold px-2 py-1 rounded-md">Switch</button>
      </div>
      
      {/* Suggestions */}
      <div className="mb-5 flex justify-between items-center">
        <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Suggestions For You</h3>
        <button className="text-xs font-semibold hover:text-primary transition-colors">See All</button>
      </div>
      
      <div className="space-y-4">
        {suggestionsData.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
            <Avatar className="h-10 w-10 ring-1 ring-primary/20 border-2 border-white dark:border-gray-900">
              <AvatarImage src={suggestion.profileImage} alt={`${suggestion.username}'s profile`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white">{suggestion.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-bold">{suggestion.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.reason}</p>
            </div>
            <Button 
              variant="ghost" 
              className={`ml-auto text-xs font-semibold ${
                followedUsers.includes(suggestion.id) 
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' 
                  : 'text-primary hover:text-primary/80 hover:bg-primary/10'
              }`}
              onClick={() => handleFollow(suggestion.id)}
            >
              {followedUsers.includes(suggestion.id) ? 'Following' : 'Follow'}
            </Button>
          </div>
        ))}
      </div>
      
      {/* Footer Links */}
      <div className="mt-10 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex flex-wrap gap-2 mb-4">
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Help</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Press</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">API</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Jobs</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Locations</a>
        </div>
        <p className="font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text inline-block">© 2024 CONNECTX</p>
      </div>
    </aside>
  );
}
