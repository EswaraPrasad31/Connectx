import { Link } from 'wouter';
import { Home, Search, Compass, Film } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MobileNavProps = {
  onNavigate: (page: string) => void;
  userImage: string;
};

export default function MobileNav({ onNavigate, userImage }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-3 z-40 transition-colors duration-300">
      <Link href="/">
        <a className="text-2xl">
          <Home className="h-6 w-6" />
        </a>
      </Link>
      
      <button 
        className="text-2xl" 
        onClick={() => onNavigate('search')}
      >
        <Search className="h-6 w-6" />
      </button>
      
      <button 
        className="text-2xl" 
        onClick={() => onNavigate('explore')}
      >
        <Compass className="h-6 w-6" />
      </button>
      
      <button 
        className="text-2xl" 
        onClick={() => onNavigate('reels')}
      >
        <Film className="h-6 w-6" />
      </button>
      
      <Link href="/profile">
        <a className="flex items-center justify-center">
          <Avatar className="h-6 w-6">
            <AvatarImage src={userImage} alt="Your profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </a>
      </Link>
    </nav>
  );
}
