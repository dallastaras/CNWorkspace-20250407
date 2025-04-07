import React from 'react';
import { useStore } from '../../../store/useStore';
import { Plus, X, FileText, Video, Link2 } from 'lucide-react';

interface Resource {
  title: string;
  description: string;
  type: 'pdf' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
}

interface CourseResourcesProps {
  resources: Resource[];
  onResourceChange: (index: number, updates: Partial<Resource>) => void;
  onAddResource: () => void;
  onRemoveResource: (index: number) => void;
}

export const CourseResources: React.FC<CourseResourcesProps> = ({
  resources,
  onResourceChange,
  onAddResource,
  onRemoveResource
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Resources
      </h2>
      
      <div className="space-y-6">
        {resources.map((resource, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg mr-4 ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                {resource.type === 'pdf' && <FileText className="w-5 h-5 text-indigo-600" />}
                {resource.type === 'video' && <Video className="w-5 h-5 text-indigo-600" />}
                {resource.type === 'link' && <Link2 className="w-5 h-5 text-indigo-600" />}
              </div>
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Resource Title
                </label>
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => onResourceChange(index, { title: e.target.value })}
                  placeholder={`Enter ${resource.type} title`}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-600 text-white border-gray-500'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-1`}>
                Description
              </label>
              <input
                type="text"
                value={resource.description}
                onChange={(e) => onResourceChange(index, { description: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  URL
                </label>
                <input
                  type="url"
                  value={resource.url}
                  onChange={(e) => onResourceChange(index, { url: e.target.value })}
                  placeholder={`Enter ${resource.type} URL`}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-600 text-white border-gray-500'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              {resource.type === 'pdf' && (
                <div>
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-1`}>
                    File Size
                  </label>
                  <input
                    type="text"
                    value={resource.size}
                    onChange={(e) => onResourceChange(index, { size: e.target.value })}
                    placeholder="e.g., 2.4 MB"
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onRemoveResource(index)}
                className={`flex items-center px-3 py-1 rounded-md ${
                  darkMode
                    ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                    : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                Remove Resource
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={onAddResource}
          className={`flex items-center px-4 py-2 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } rounded-lg`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Resource
        </button>
      </div>
    </div>
  );
};