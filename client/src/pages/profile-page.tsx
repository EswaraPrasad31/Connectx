import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Settings, Bookmark, MessageSquare } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import MobileNav from '@/components/mobile-nav';
import VoiceIndicator from '@/components/voice-indicator';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { useLocation } from 'wouter';

// Sample user posts for display
const userPosts = [
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    likes: 215,
    comments: 31
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRlY2glMjBjb25mZXJlbmNlfGVufDB8fDB8fHww",
    likes: 68,
    comments: 5
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcHV0ZXIlMjBwcm9ncmFtbWluZ3xlbnwwfHwwfHx8MA%3D%3D",
    likes: 142,
    comments: 12
  }
];

// User stats
const userStats = {
  posts: 3,
  followers: 845,
  following: 312
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  
  // Voice commands setup
  const voiceCommands = {
    "edit profile": () => setIsEditingProfile(true),
    "view posts": () => document.getElementById('posts-tab')?.click(),
    "view saved": () => document.getElementById('saved-tab')?.click(),
    "view tagged": () => document.getElementById('tagged-tab')?.click()
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
            else if (page === 'explore') {
              setLocation('/explore');
            }
            else console.log(`Navigate to ${page}`);
          }} 
        />
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          <div className="px-4 py-6 max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <Avatar className="h-24 w-24 md:h-36 md:w-36 mb-4 md:mb-0 md:mr-8 ring-4 ring-white dark:ring-gray-800">
                <AvatarImage src={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="text-xl font-bold mb-2 md:mb-0 md:mr-4">{user.username}</h1>
                  <div className="flex justify-center md:justify-start space-x-2 mb-4 md:mb-0">
                    <Button 
                      variant="outline" 
                      className="h-9 px-4"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* User Stats */}
                <div className="flex justify-center md:justify-start space-x-6 my-4">
                  <div>
                    <span className="font-semibold">{userStats.posts}</span> posts
                  </div>
                  <div>
                    <span className="font-semibold">{userStats.followers}</span> followers
                  </div>
                  <div>
                    <span className="font-semibold">{userStats.following}</span> following
                  </div>
                </div>
                
                {/* Bio */}
                <div className="max-w-md">
                  <p className="font-medium">{user.fullName || "Full Name"}</p>
                  <p className="text-sm mt-1">Software developer passionate about creating innovative solutions. Love to explore new technologies and share experiences.</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">github.com/{user.username}</p>
                </div>
              </div>
            </div>
            
            {/* Profile Content Tabs */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="posts" id="posts-tab" className="flex items-center">
                  <Grid className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Posts</span>
                </TabsTrigger>
                <TabsTrigger value="saved" id="saved-tab" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Saved</span>
                </TabsTrigger>
                <TabsTrigger value="tagged" id="tagged-tab" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Tagged</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="mt-6">
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {userPosts.map(post => (
                    <div key={post.id} className="aspect-square relative group overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={`Post ${post.id}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex space-x-4 text-white">
                          <div className="flex items-center">
                            <i className="fas fa-heart mr-2"></i>
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-comment mr-2"></i>
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="saved" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Only you can see what you've saved</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    When you save something, it'll appear here for you to easily find later.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tagged" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Photos</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    When people tag you in photos, they'll appear here.
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
          else if (page === 'explore') {
            setLocation('/explore');
          }
          else console.log(`Navigate to ${page}`);
        }}
        userImage={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"}
      />
    </div>
  );
}