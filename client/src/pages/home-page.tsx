import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

type ModalState = {
  search: boolean;
  create: boolean;
  notifications: boolean;
  messages: boolean;
  logout: boolean;
};

export default function HomePage() {
  const { user } = useAuth();
  const [activeModals, setActiveModals] = useState<ModalState>({
    search: false,
    create: false, 
    notifications: false,
    messages: false,
    logout: false
  });

  // Fetch posts for the feed
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });

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

  // Setup voice commands
  const voiceCommands = {
    "home": () => closeAllModals(),
    "search": () => toggleModal("search"),
    "explore": () => console.log("Navigate to explore"),
    "reels": () => console.log("Navigate to reels"),
    "messages": () => toggleModal("messages"),
    "notifications": () => toggleModal("notifications"),
    "create": () => toggleModal("create"),
    "profile": () => console.log("Navigate to profile"),
    "logout": () => toggleModal("logout"),
    "dark mode": () => document.documentElement.classList.add("dark"),
    "light mode": () => document.documentElement.classList.remove("dark")
  };

  const { isListening } = useVoiceCommands(voiceCommands);

  if (!user) return null;

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
            else console.log(`Navigate to ${page}`);
          }} 
        />

        {/* Main Content - Positioned to left side */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0 max-w-[470px]">
          <div className="px-1 pt-4 md:pt-6 ml-auto md:ml-12">
            {/* Stories Section */}
            <Stories />
            
            {/* Posts Feed */}
            <div className="space-y-4">
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
