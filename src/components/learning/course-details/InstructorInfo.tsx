import React from 'react';
import { useStore } from '../../../store/useStore';

interface InstructorInfoProps {
  name: string;
  title?: string;
  avatarUrl?: string;
  onUpdate: (updates: Partial<{
    instructor_name: string;
    instructor_title: string;
    instructor_avatar_url: string;
  }>) => void;
}

export const InstructorInfo: React.FC<InstructorInfoProps> = ({
  name,
  title,
  avatarUrl,
  onUpdate
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Instructor Information
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Instructor Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onUpdate({ instructor_name: e.target.value })}
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
              Instructor Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdate({ instructor_title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}>
            Instructor Avatar URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => onUpdate({ instructor_avatar_url: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-indigo-500`}
          />
        </div>
      </div>
    </div>
  );
};