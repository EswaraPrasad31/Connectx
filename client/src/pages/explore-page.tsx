import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '@/components/sidebar';
import MobileNav from '@/components/mobile-nav';
import VoiceIndicator from '@/components/voice-indicator';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Video, ShoppingBag, User } from 'lucide-react';
import { useLocation } from 'wouter';

// Sample explore content
const exploreContent = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFuZHNjYXBlfGVufDB8fDB8fHww",
    likes: 12453,
    comments: 392,
    isVideo: false
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
    likes: 8923,
    comments: 142,
    isVideo: false
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    likes: 21478,
    comments: 538,
    isVideo: false
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHww",
    likes: 7654,
    comments: 245,
    isVideo: true
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    likes: 9567,
    comments: 178,
    isVideo: false
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
    likes: 15762,
    comments: 421,
    isVideo: false
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D",
    likes: 6389,
    comments: 102,
    isVideo: false
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWV8ZW58MHx8MHx8fDA%3D",
    likes: 11243,
    comments: 376,
    isVideo: true
  },
  {
    id: 9,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fHww",
    likes: 19872,
    comments: 532,
    isVideo: false
  },
  {
    id: 10,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    likes: 8427,
    comments: 187,
    isVideo: false
  },
  {
    id: 11,
    imageUrl: "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMGdhZGdldHxlbnwwfHwwfHx8MA%3D%3D",
    likes: 5183,
    comments: 93,
    isVideo: false
  },
  {
    id: 12,
    imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
    likes: 7629,
    comments: 154,
    isVideo: true
  }
];

export default function ExplorePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Voice commands setup
  const voiceCommands = {
    "search": () => document.getElementById('search-input')?.focus(),
    "photos": () => document.getElementById('photos-tab')?.click(),
    "videos": () => document.getElementById('videos-tab')?.click(),
    "shop": () => document.getElementById('shop-tab')?.click(),
    "accounts": () => document.getElementById('accounts-tab')?.click(),
    "home": () => setLocation("/"),
    "profile": () => setLocation("/profile")
  };
  
  const { isListening } = useVoiceCommands(voiceCommands);
  
  if (!user) return <div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Voice Indicator */}
      <VoiceIndicator isActive={isListening} />
      
      {/* Main Layout */}
      <div className="flex min-h-screen pt-14 md:pt-0">
        {/* Sidebar (desktop) */}
        <Sidebar 
          onNavigate={(page) => {
            if (page === 'home') {
              setLocation('/');
            } 
            else if (page === 'profile') {
              setLocation('/profile');
            }
            else console.log(`Navigate to ${page}`);
          }} 
        />
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          <div className="px-4 py-6 max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search"
                  className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Explore Tabs */}
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="photos" id="photos-tab" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Photos</span>
                </TabsTrigger>
                <TabsTrigger value="videos" id="videos-tab" className="flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="shop" id="shop-tab" className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Shop</span>
                </TabsTrigger>
                <TabsTrigger value="accounts" id="accounts-tab" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Accounts</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="mt-6">
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {exploreContent.filter(item => !item.isVideo).map(item => (
                    <div key={item.id} className="aspect-square relative group overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={`Explore item ${item.id}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex space-x-4 text-white">
                          <div className="flex items-center">
                            <i className="fas fa-heart mr-2"></i>
                            <span>{item.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-comment mr-2"></i>
                            <span>{item.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos" className="mt-6">
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {exploreContent.filter(item => item.isVideo).map(item => (
                    <div key={item.id} className="aspect-square relative group overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={`Video item ${item.id}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 right-3">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex space-x-4 text-white">
                          <div className="flex items-center">
                            <i className="fas fa-heart mr-2"></i>
                            <span>{item.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-comment mr-2"></i>
                            <span>{item.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="shop" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Shop Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    We're working on making shopping available in your region.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="accounts" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Discover Accounts</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Search for accounts to follow and discover popular content creators.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav 
        onNavigate={(page) => {
          if (page === 'home') {
            setLocation('/');
          } 
          else if (page === 'profile') {
            setLocation('/profile');
          }
          else console.log(`Navigate to ${page}`);
        }}
        userImage={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"}
      />
    </div>
  );
}