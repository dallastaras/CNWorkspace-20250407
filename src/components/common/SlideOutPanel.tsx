import React from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';

interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'half' | 'full';
}

export const SlideOutPanel: React.FC<SlideOutPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  width = 'md'
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const getWidthClass = () => {
    switch (width) {
      case 'full':
        return 'max-w-full';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '3xl':
        return 'max-w-3xl';
      case '4xl':
        return 'max-w-4xl';
      case '5xl':
        return 'max-w-5xl';
      case 'half':
        return 'max-w-[50vw]';
      default:
        return 'max-w-md';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className="absolute inset-0">
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-gray-500 transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-75' : 'opacity-0'
          }`} 
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="fixed inset-y-0 right-0 flex pl-10">
          <div className={`w-screen ${getWidthClass()} transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl flex flex-col`}>
              {/* Header */}
              <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {icon}
                    <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className={`rounded-md ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-400 hover:text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {subtitle && (
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};