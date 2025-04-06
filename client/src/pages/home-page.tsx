import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Stories from "@/components/stories";
import PostCard from "@/components/post-card";
import Suggestions from "@/components/suggestions";
import MobileNav from "@/components/mobile-nav";
import SearchModal from "@/components/modals/search-modal";
import CreatePostModal from "@/components/modals/create-post-modal";
import NotificationsModal from "@/components/modals/notifications-modal";
import MessagesModal from "@/components/modals/messages-modal";
import LogoutModal from "@/components/modals/logout-modal";
import VoiceIndicator from "@/components/voice-indicator";
import { useVoiceCommands } from "@/hooks/use-voice-commands";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

// Sample posts data for demonstration
const samplePosts = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Amazing dinner at this new restaurant! The food was incredible 🍽️ #foodie #weekend",
    createdAt: "2025-04-06T12:30:00.000Z",
    likeCount: 142,
    commentCount: 23,
    user: {
      id: 2,
      username: "jaideep",
      profileImage: "https://randomuser.me/api/portraits/men/42.jpg"
    }
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMGdhZGdldHxlbnwwfHwwfHx8MA%3D%3D",
    caption: "Just got the newest gadget! Can't wait to try it out. #tech #innovation",
    createdAt: "2025-04-06T09:15:00.000Z",
    likeCount: 89,
    commentCount: 12,
    user: {
      id: 3,
      username: "shiva",
      profileImage: "https://randomuser.me/api/portraits/men/33.jpg"
    }
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMGNpdHl8ZW58MHx8MHx8fDA%3D",
    caption: "Beautiful sunset in the city today! 🌇 #citylife #sunset #views",
    createdAt: "2025-04-05T18:45:00.000Z",
    likeCount: 321,
    commentCount: 42,
    user: {
      id: 7,
      username: "anjali",
      profileImage: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  }
];

type ModalState = {
  search: boolean;
  create: boolean;
  notifications: boolean;
  messages: boolean;
  logout: boolean;
};

export default function HomePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModals, setActiveModals] = useState<ModalState>({
    search: false,
    create: false, 
    notifications: false,
    messages: false,
    logout: false
  });
  
  // Reference to the main content area for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch posts for the feed
  const { data: apiPosts = [], isLoading: isLoadingPosts } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });
  
  // Function to refresh the feed data with visual feedback
  const refreshFeed = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
  };
  
  // Reset the refreshing state after loading completes
  useEffect(() => {
    if (!isLoadingPosts && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isLoadingPosts, isRefreshing]);
  
  // Use sample posts if no posts are returned from the API
  const posts = apiPosts.length > 0 ? apiPosts : samplePosts;

  const toggleModal = (modal: keyof ModalState) => {
    setActiveModals(prev => ({
      ...prev,
      [modal]: !prev[modal]
    }));
  };

  const closeAllModals = () => {
    setActiveModals({
      search: false,
      create: false,
      notifications: false,
      messages: false,
      logout: false
    });
  };

  // Function to scroll to the top of the page and refresh data
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    refreshFeed();
  };

  // Setup voice commands
  const voiceCommands = {
    "home": () => {
      closeAllModals();
      scrollToTop();
    },
    "search": () => toggleModal("search"),
    "explore": () => setLocation("/explore"),
    "reels": () => console.log("Navigate to reels"),
    "messages": () => toggleModal("messages"),
    "notifications": () => toggleModal("notifications"),
    "create": () => toggleModal("create"),
    "profile": () => setLocation("/profile"),
    "logout": () => toggleModal("logout"),
    "dark mode": () => document.documentElement.classList.add("dark"),
    "light mode": () => document.documentElement.classList.remove("dark")
  };

  const { isListening } = useVoiceCommands(voiceCommands);

  if (!user) return <div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Voice Indicator */}
      <VoiceIndicator isActive={isListening} />
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <h1 className="text-xl font-bold">ConnectX</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              // This is a workaround as useVoiceCommands is a hook, not a function
              console.log("Voice command initiated");
            }} 
            className="text-gray-900 dark:text-gray-100"
          >
            <i className="fas fa-microphone"></i>
          </button>
          <button onClick={() => toggleModal("messages")} className="text-gray-900 dark:text-gray-100">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-screen pt-14 md:pt-0">
        {/* Sidebar (desktop) */}
        <Sidebar 
          onNavigate={(page) => {
            if (page === 'search') toggleModal('search');
            else if (page === 'create') toggleModal('create');
            else if (page === 'notifications') toggleModal('notifications');
            else if (page === 'messages') toggleModal('messages');
            else if (page === 'logout') toggleModal('logout');
            else if (page === 'home') {
              scrollToTop();
            }
            else if (page === 'explore') {
              setLocation('/explore');
            }
            else if (page === 'profile') {
              setLocation('/profile');
            }
            else console.log(`Navigate to ${page}`);
          }} 
        />

        {/* Main Content - Positioned to extend to suggestion panel */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0 mr-0 lg:mr-80 relative" ref={contentRef}>
          {/* Loading Indicator */}
          {(isRefreshing || isLoadingPosts) && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className={`px-1 pt-4 md:pt-6 md:ml-12 md:pr-4 transition-opacity duration-300 ${isRefreshing || isLoadingPosts ? 'opacity-50' : 'opacity-100'}`}>
            {/* Stories Section */}
            <Stories />
            
            {/* Posts Feed */}
            <div className="space-y-4 max-w-[470px]">
              {isLoadingPosts ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden animate-pulse">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-96 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : posts.length > 0 ? (
                // Actual posts
                posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                // No posts state
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 text-center">
                  <div className="text-5xl mb-4 text-gray-400">
                    <i className="far fa-images"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Connect with friends or create your first post to see content here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Suggestions Panel (desktop only) as a true sidebar */}
        <Suggestions user={user} />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        onNavigate={(page) => {
          if (page === 'search') toggleModal('search');
          else if (page === 'home') {
            scrollToTop();
          }
          else if (page === 'explore') {
            setLocation('/explore');
          }
          else if (page === 'profile') {
            setLocation('/profile');
          }
          else console.log(`Navigate to ${page}`);
        }}
        userImage={user.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"}
      />

      {/* Modals */}
      <SearchModal 
        isOpen={activeModals.search} 
        onClose={() => toggleModal('search')} 
      />
      
      <CreatePostModal 
        isOpen={activeModals.create} 
        onClose={() => toggleModal('create')} 
      />
      
      <NotificationsModal 
        isOpen={activeModals.notifications} 
        onClose={() => toggleModal('notifications')} 
      />
      
      <MessagesModal 
        isOpen={activeModals.messages} 
        onClose={() => toggleModal('messages')} 
      />
      
      <LogoutModal 
        isOpen={activeModals.logout} 
        onClose={() => toggleModal('logout')} 
      />
    </div>
  );
}
