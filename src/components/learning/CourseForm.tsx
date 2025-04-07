import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { getRoles, getModules } from '../../lib/api';
import { 
  GraduationCap,
  Users,
  Clock,
  FileText,
  Video,
  Link2,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  sys_platforms: {
    name: string;
  };
}

interface CourseFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    duration?: string;
    instructor_name: string;
    instructor_title?: string;
    instructor_avatar_url?: string;
    objectives: string[];
    prerequisites: string[];
    passing_score: number;
    is_published: boolean;
    modules?: Array<{
      moduleId: string;
      isRequired: boolean;
    }>;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
  const [requiredModules, setRequiredModules] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    thumbnail_url: '',
    duration: '',
    instructor_name: '',
    instructor_title: '',
    instructor_avatar_url: '',
    objectives: [''],
    prerequisites: [''],
    passing_score: 80,
    is_published: false,
    modules: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, modulesData] = await Promise.all([
          getRoles(),
          getModules()
        ]);

        setRoles(rolesData);
        setModules(modulesData);

        // Initialize selected modules from initial data
        if (initialData?.modules) {
          const selected: Record<string, boolean> = {};
          const required: Record<string, boolean> = {};
          initialData.modules.forEach(m => {
            selected[m.moduleId] = true;
            required[m.moduleId] = m.isRequired;
          });
          setSelectedModules(selected);
          setRequiredModules(required);
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load form data');
      }
    };

    fetchData();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Prepare modules data
      const moduleData = Object.entries(selectedModules)
        .filter(([_, isSelected]) => isSelected)
        .map(([moduleId]) => ({
          moduleId,
          isRequired: requiredModules[moduleId] || false
        }));

      await onSubmit({
        ...formData,
        modules: moduleData
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (
    field: 'objectives' | 'prerequisites',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'objectives' | 'prerequisites') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field: 'objectives' | 'prerequisites', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {initialData ? 'Edit Course' : 'Create Course'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className={`flex items-center px-4 py-2 ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <button
            type="submit"
            form="course-form"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Course
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}

      <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-1`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
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
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                  value={formData.instructor_name}
                  onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                  required
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
                  value={formData.instructor_title}
                  onChange={(e) => setFormData({ ...formData, instructor_title: e.target.value })}
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
                value={formData.instructor_avatar_url}
                onChange={(e) => setFormData({ ...formData, instructor_avatar_url: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Learning Objectives
          </h2>
          
          <div className="space-y-4">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                  placeholder="Enter a learning objective"
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('objectives', index)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('objectives')}
              className={`flex items-center px-4 py-2 ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-lg`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Objective
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Prerequisites
          </h2>
          
          <div className="space-y-4">
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => handleArrayFieldChange('prerequisites', index, e.target.value)}
                  placeholder="Enter a prerequisite"
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('prerequisites', index)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('prerequisites')}
              className={`flex items-center px-4 py-2 ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-lg`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prerequisite
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Module Requirements
          </h2>
          
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedModules(prev => ({
                          ...prev,
                          [module.id]: !prev[module.id]
                        }))}
                        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600`}
                      >
                        {selectedModules[module.id] ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Square className={`w-5 h-5 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        )}
                      </button>
                      <div>
                        <h3 className={`text-sm font-medium ${
                          darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {module.name}
                        </h3>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {module.sys_platforms.name}
                        </p>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {module.description}
                    </p>
                  </div>
                  {selectedModules[module.id] && (
                    <div className="ml-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={requiredModules[module.id] || false}
                          onChange={(e) => setRequiredModules(prev => ({
                            ...prev,
                            [module.id]: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Required
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

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
                value={formData.passing_score}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
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
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
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
      </form>
    </div>
  );
};