import React from 'react';
import { useStore } from '../../../store/useStore';

interface BasicInfoProps {
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: string;
  onUpdate: (updates: Partial<{
    title: string;
    description: string;
    thumbnail_url: string;
    duration: string;
  }>) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  title,
  description,
  thumbnailUrl,
  duration,
  onUpdate
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Course Details
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}>
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            className={`w-full px-3 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => onUpdate({ thumbnail_url: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => onUpdate({ duration: e.target.value })}
              placeholder="e.g., 45 minutes"
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};