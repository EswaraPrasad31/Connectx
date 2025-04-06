import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

type SidebarProps = {
  onNavigate: (page: string) => void;
};

const navItems = [
  { icon: 'fa-home', label: 'Home', page: 'home' },
  { icon: 'fa-search', label: 'Search', page: 'search' },
  { icon: 'fa-compass', label: 'Explore', page: 'explore' },
  { icon: 'fa-film', label: 'Reels', page: 'reels' },
  { icon: 'fa-paper-plane', label: 'Messages', page: 'messages', badge: 3 },
  { icon: 'fa-heart', label: 'Notifications', page: 'notifications' },
  { icon: 'fa-plus-square', label: 'Create', page: 'create' },
  { icon: 'fa-user', label: 'Profile', page: 'profile' },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const handleNavigation = (page: string) => {
    setActivePage(page);
    onNavigate(page);
  };

  const toggleMoreDropdown = () => {
    setMoreDropdownOpen(!moreDropdownOpen);
  };

  return (
    <aside className="hidden md:flex flex-col fixed h-full w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-30 transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text font-sans">ConnectX</h1>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a 
              key={item.page}
              href="#" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                activePage === item.page ? 'font-semibold bg-gray-100 dark:bg-gray-700' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.page);
              }}
            >
              <i className={`fas ${item.icon} w-6 text-xl`}></i>
              <span className="ml-3">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-[#E1306C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>
      
      {/* More Menu at Bottom */}
      <div className="mt-auto p-6">
        <div className="relative">
          <button 
            onClick={toggleMoreDropdown}
            className="flex items-center p-3 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-bars w-6 text-xl"></i>
            <span className="ml-3">More</span>
          </button>
          
          {moreDropdownOpen && (
            <div className="absolute bottom-16 left-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('settings');
                  }}
                >
                  Settings
                </a>
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('activity');
                  }}
                >
                  Your Activity
                </a>
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('saved');
                  }}
                >
                  Saved
                </a>
                <button 
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={toggleTheme}
                >
                  Switch appearance
                </button>
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('switch-account');
                  }}
                >
                  Switch account
                </a>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <a 
                  href="#" 
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('logout');
                  }}
                >
                  Log out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
