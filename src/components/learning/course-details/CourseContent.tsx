import React from 'react';
import { useStore } from '../../../store/useStore';
import { Plus, X } from 'lucide-react';

interface Section {
  title: string;
  content: string[];
  video_url?: string;
  duration?: string;
}

interface CourseContentProps {
  sections: Section[];
  onSectionChange: (index: number, updates: Partial<Section>) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  sections,
  onSectionChange,
  onAddSection,
  onRemoveSection
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Course Content
      </h2>
      
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => onSectionChange(index, { title: e.target.value })}
                placeholder="Section Title"
                className={`flex-1 px-3 py-2 rounded-lg mr-4 ${
                  darkMode
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-500`}
              />
              <button
                onClick={() => onRemoveSection(index)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                    : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {section.content.map((content, contentIndex) => (
                <div key={contentIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => {
                      const newContent = [...section.content];
                      newContent[contentIndex] = e.target.value;
                      onSectionChange(index, { content: newContent });
                    }}
                    placeholder="Content item"
                    className={`flex-1 px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    onClick={() => {
                      const newContent = section.content.filter((_, i) => i !== contentIndex);
                      onSectionChange(index, { content: newContent });
                    }}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                        : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newContent = [...section.content, ''];
                  onSectionChange(index, { content: newContent });
                }}
                className={`flex items-center px-4 py-2 ${
                  darkMode
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } rounded-lg`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content Item
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Video URL
                </label>
                <input
                  type="url"
                  value={section.video_url}
                  onChange={(e) => onSectionChange(index, { video_url: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-600 text-white border-gray-500'
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
                  value={section.duration}
                  onChange={(e) => onSectionChange(index, { duration: e.target.value })}
                  placeholder="e.g., 15 minutes"
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-600 text-white border-gray-500'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={onAddSection}
          className={`flex items-center px-4 py-2 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } rounded-lg`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Section
        </button>
      </div>
    </div>
  );
};