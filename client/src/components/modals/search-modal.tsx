import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, this would trigger an API search
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Search</DialogTitle>
          {/* Removed extra close button, dialog already has a built-in close button */}
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
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Recent searches</p>
            <div className="space-y-3">
              {/* Recent search items would go here */}
              <p className="text-gray-400 dark:text-gray-500 text-center text-sm">No recent searches</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
