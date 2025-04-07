import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Grid, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import Navigation from './Navigation';
import ModuleLauncher from './ModuleLauncher';
import UserMenu from './UserMenu';
import ChatPanel from './ChatPanel';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`lg:hidden fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-75' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Logo className="h-12 -mt-0.5" />
          <button
            onClick={onClose}
            className={`p-2 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Navigation mobile onNavClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default function Layout() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [isModuleLauncherOpen, setIsModuleLauncherOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b fixed top-0 left-0 right-0 z-10`}>
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => mobile ? setIsMobileNavOpen(true) : setIsNavCollapsed(!isNavCollapsed)}
                className={`lg:hidden p-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                } hidden lg:flex`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className={`p-2 rounded-md lg:hidden ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Logo className={`h-12 -mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModuleLauncherOpen(true)}
                className={`p-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
              >
                <Grid className="h-6 w-6" />
              </button>
              <UserMenu user={user} setUser={setUser} navigate={navigate} />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <div className={`hidden lg:flex h-full transition-all duration-300 ${isNavCollapsed ? 'w-0' : 'w-64'}`}>
          <div className="relative flex-1">
            <Navigation collapsed={isNavCollapsed} />
          </div>
        </div>
        <main className={`flex-1 overflow-auto p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>

      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <ModuleLauncher 
        isOpen={isModuleLauncherOpen} 
        onClose={() => setIsModuleLauncherOpen(false)} 
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}