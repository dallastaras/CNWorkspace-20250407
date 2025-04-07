import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { ChevronDown, Check } from 'lucide-react';

interface QuickFillOption {
  label: string;
  value: number;
}

interface QuickFillButtonProps {
  options: QuickFillOption[];
  onSelect: (value: number) => void;
}

export const QuickFillButton: React.FC<QuickFillButtonProps> = ({ options, onSelect }) => {
  const darkMode = useStore((state) => state.darkMode);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-2 py-1 text-xs rounded-lg ${
          darkMode 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Quick Fill
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg overflow-hidden z-10 ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};