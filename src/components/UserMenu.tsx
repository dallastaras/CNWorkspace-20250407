import React, { useState, useRef, useEffect } from 'react';
import { signOut } from '../lib/auth';
import { useStore } from '../store/useStore';
import { User, Settings, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: any;
  setUser: (user: any) => void;
  navigate: (path: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, setUser, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-2 rounded-full ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || user.email}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.first_name?.[0] || user?.email?.[0].toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } ring-1 ring-black ring-opacity-5`}>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/preferences');
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </button>
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;