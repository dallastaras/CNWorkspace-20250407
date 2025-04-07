import React from 'react';
import { useStore } from '../../store/useStore';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon: Icon = AlertCircle 
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
      <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {message}
      </p>
    </div>
  );
};