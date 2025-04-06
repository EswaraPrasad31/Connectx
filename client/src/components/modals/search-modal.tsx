import { useState, useEffect } from 'react';
import { Search, X, Clock, User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SearchItem = {
  id: number;
  query: string;
  timestamp: Date;
  type: 'query' | 'user';
  user?: {
    username: string;
    profileImage: string;
  };
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  
  // Load searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        // Parse the JSON string and convert timestamp strings back to Date objects
        const parsedSearches = JSON.parse(savedSearches);
        const formattedSearches = parsedSearches.map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        }));
        setRecentSearches(formattedSearches);
      } catch (error) {
        console.error('Error parsing saved searches:', error);
      }
    }
  }, []);
  
  // Save searches to localStorage whenever they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Add the new search to recent searches
    const newSearch: SearchItem = {
      id: Date.now(),
      query: searchQuery,
      timestamp: new Date(),
      type: 'query'
    };
    
    // Add to beginning of array and limit to 10 recent searches
    setRecentSearches(prev => [newSearch, ...prev.slice(0, 9)]);
    
    console.log('Searching for:', searchQuery);
    // In a real app, this would trigger an API search
  };
  
  const clearSearch = (id: number) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };
  
  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text" 
                placeholder="Search" 
                className="w-full py-2 pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="mt-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Recent searches</p>
              {recentSearches.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-xs text-primary hover:text-primary/80"
                  onClick={clearAllSearches}
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {recentSearches.length > 0 ? (
                recentSearches.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center">
                      {item.type === 'user' && item.user ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.user.profileImage} alt={item.user.username} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <Clock className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {item.type === 'user' && item.user 
                            ? item.user.username 
                            : item.query}
                        </p>
                        {item.type === 'user' && (
                          <p className="text-xs text-gray-500">User</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => clearSearch(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-center text-sm">No recent searches</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
