import { Link } from 'wouter';
import { Home, Search, Compass, Film } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MobileNavProps = {
  onNavigate: (page: string) => void;
  userImage: string;
};

export default function MobileNav({ onNavigate, userImage }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-4 z-40 transition-colors duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
      <div 
        className="flex flex-col items-center" 
        onClick={() => onNavigate('home')}
      >
        <Home className="h-6 w-6 text-primary" />
        <span className="text-[10px] mt-1 font-medium">Home</span>
      </div>
      
      <button 
        className="flex flex-col items-center" 
        onClick={() => onNavigate('search')}
      >
        <Search className="h-6 w-6 hover:text-primary transition-colors" />
        <span className="text-[10px] mt-1 font-medium">Search</span>
      </button>
      
      <button 
        className="flex flex-col items-center" 
        onClick={() => onNavigate('explore')}
      >
        <Compass className="h-6 w-6 hover:text-primary transition-colors" />
        <span className="text-[10px] mt-1 font-medium">Explore</span>
      </button>
      
      <button 
        className="flex flex-col items-center" 
        onClick={() => onNavigate('reels')}
      >
        <Film className="h-6 w-6 hover:text-primary transition-colors" />
        <span className="text-[10px] mt-1 font-medium">Reels</span>
      </button>
      
      <div 
        className="flex flex-col items-center"
        onClick={() => onNavigate('profile')}
      >
        <Avatar className="h-7 w-7 border-2 border-primary/30">
          <AvatarImage src={userImage} alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-white font-bold">U</AvatarFallback>
        </Avatar>
        <span className="text-[10px] mt-1 font-medium">Profile</span>
      </div>
    </nav>
  );
}
