import React from 'react';
import { useStore } from '../../store/useStore';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = 'h-4 w-full',
  count = 1 
}) => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } ${className}`}
        />
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...'
}) => {
  const darkMode = useStore(state => state.darkMode);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } opacity-75`} />
      <div className="relative flex flex-col items-center space-y-4 p-8 rounded-lg">
        <LoadingSpinner size="lg" className={darkMode ? 'text-white' : 'text-gray-900'} />
        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};