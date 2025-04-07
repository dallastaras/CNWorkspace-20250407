import React from 'react';
import { useStore } from '../../store/useStore';
import { Keyboard, X } from 'lucide-react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const darkMode = useStore(state => state.darkMode);
  const { shortcuts } = useKeyboardShortcuts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`inline-block align-bottom ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Keyboard className={`w-5 h-5 mr-2 ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Keyboard Shortcuts
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`rounded-md ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {shortcuts.map(({ key, description }) => (
              <div 
                key={key}
                className="flex items-center justify-between"
              >
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {description}
                </span>
                <kbd className={`px-2 py-1 text-xs font-semibold ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                } border rounded`}>
                  {key}
                </kbd>
              </div>
            ))}
          </div>

          <div className={`mt-6 text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Press <kbd className="px-1 py-0.5 rounded border">?</kbd> to show/hide this help dialog
          </div>
        </div>
      </div>
    </div>
  );
};