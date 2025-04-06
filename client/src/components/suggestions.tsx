import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@shared/schema';

type SuggestionsProps = {
  user: Omit<User, 'password'>;
};

// Sample suggestion data
const suggestionsData = [
  {
    id: 1,
    username: "michael_j",
    fullName: "Michael Johnson",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    reason: "New to ConnectX"
  },
  {
    id: 2,
    username: "robert_tech",
    fullName: "Robert Williams",
    profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
    reason: "Follows you"
  },
  {
    id: 3,
    username: "emma_designs",
    fullName: "Emma Roberts",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    reason: "Suggested for you"
  },
  {
    id: 4,
    username: "david_photo",
    fullName: "David Miller",
    profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
    reason: "Followed by maria_p"
  }
];

export default function Suggestions({ user }: SuggestionsProps) {
  return (
    <aside className="hidden lg:block w-80 p-8 fixed right-0 top-0 h-full overflow-y-auto">
      {/* User Profile */}
      <div className="flex items-center mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"} alt="Your profile" />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-semibold text-sm">{user.username}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{user.fullName || "Your Name"}</p>
        </div>
        <button className="ml-auto text-primary text-xs font-semibold">Switch</button>
      </div>
      
      {/* Suggestions */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Suggestions For You</h3>
        <button className="text-xs font-semibold">See All</button>
      </div>
      
      <div className="space-y-3">
        {suggestionsData.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={suggestion.profileImage} alt={`${suggestion.username}'s profile`} />
              <AvatarFallback>{suggestion.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-semibold">{suggestion.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.reason}</p>
            </div>
            <Button 
              variant="ghost" 
              className="ml-auto text-primary text-xs font-semibold"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
      
      {/* Footer Links */}
      <div className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex flex-wrap gap-2 mb-3">
          <a href="#" className="hover:underline">About</a>
          <span>•</span>
          <a href="#" className="hover:underline">Help</a>
          <span>•</span>
          <a href="#" className="hover:underline">Press</a>
          <span>•</span>
          <a href="#" className="hover:underline">API</a>
          <span>•</span>
          <a href="#" className="hover:underline">Jobs</a>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>•</span>
          <a href="#" className="hover:underline">Locations</a>
        </div>
        <p>© 2024 CONNECTX</p>
      </div>
    </aside>
  );
}
