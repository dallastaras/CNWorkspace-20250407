import React from 'react';
import { useStore } from '../../../store/useStore';

interface CourseSettingsProps {
  passingScore: number;
  isPublished: boolean;
  onUpdate: (updates: Partial<{
    passing_score: number;
    is_published: boolean;
  }>) => void;
}

export const CourseSettings: React.FC<CourseSettingsProps> = ({
  passingScore,
  isPublished,
  onUpdate
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Course Settings
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}>
            Passing Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={passingScore}
            onChange={(e) => onUpdate({ passing_score: parseInt(e.target.value) })}
            className={`w-32 px-3 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-indigo-500`}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_published"
            checked={isPublished}
            onChange={(e) => onUpdate({ is_published: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_published"
            className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Publish course immediately
          </label>
        </div>
      </div>
    </div>
  );
};