import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GraduationCap, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { getLearningCourses, createLearningCourse, updateLearningCourse } from '../lib/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { toast } from '../components/common/Toast';

interface CourseFormData {
  title: string;
  description: string;
  thumbnail_url?: string;
  duration?: string;
  instructor_name: string;
  instructor_title?: string;
  instructor_avatar_url?: string;
  objectives: string[];
  prerequisites?: string[];
  passing_score: number;
  is_published: boolean;
  sections: Array<{
    title: string;
    content: string[];
    video_url?: string;
    duration?: string;
  }>;
  resources: Array<{
    title: string;
    description: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
  }>;
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: number;
  }>;
}

const CreateCourse = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createLearningCourse(formData);
      toast.success('Course created successfully');
      navigate('/learning/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: keyof Pick<CourseFormData, 'objectives' | 'prerequisites'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field: keyof Pick<CourseFormData, 'objectives' | 'prerequisites'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: [''] }]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, {
        title: '',
        description: '',
        type: 'pdf',
        url: ''
      }]
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0
      }]
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create Course
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/learning/courses')}
            className={`flex items-center px-4 py-2 ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            Create Course
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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

        {/* Instructor Info */}
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

        {/* Learning Objectives */}
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
                  onChange={(e) => {
                    const newObjectives = [...formData.objectives];
                    newObjectives[index] = e.target.value;
                    setFormData({ ...formData, objectives: newObjectives });
                  }}
                  placeholder="Enter a learning objective"
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('objectives', index)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('objectives')}
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

        {/* Prerequisites */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Prerequisites
          </h2>
          
          <div className="space-y-4">
            {formData.prerequisites?.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => {
                    const newPrerequisites = [...(formData.prerequisites || [])];
                    newPrerequisites[index] = e.target.value;
                    setFormData({ ...formData, prerequisites: newPrerequisites });
                  }}
                  placeholder="Enter a prerequisite"
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('prerequisites', index)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-red-600 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('prerequisites')}
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

        {/* Course Content */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Content
          </h2>
          
          <div className="space-y-6">
            {formData.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...formData.sections];
                      newSections[sectionIndex].title = e.target.value;
                      setFormData({ ...formData, sections: newSections });
                    }}
                    placeholder="Section Title"
                    className={`flex-1 px-3 py-2 rounded-lg mr-4 ${
                      darkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
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
                          const newSections = [...formData.sections];
                          newSections[sectionIndex].content[contentIndex] = e.target.value;
                          setFormData({ ...formData, sections: newSections });
                        }}
                        placeholder="Content item"
                        className={`flex-1 px-3 py-2 rounded-lg ${
                          darkMode
                            ? 'bg-gray-600 text-white border-gray-500'
                            : 'bg-white text-gray-900 border-gray-300'
                        } border focus:ring-2 focus:ring-indigo-500`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSections = [...formData.sections];
                          newSections[sectionIndex].content = section.content.filter(
                            (_, i) => i !== contentIndex
                          );
                          setFormData({ ...formData, sections: newSections });
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
                    type="button"
                    onClick={() => {
                      const newSections = [...formData.sections];
                      newSections[sectionIndex].content.push('');
                      setFormData({ ...formData, sections: newSections });
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
                      onChange={(e) => {
                        const newSections = [...formData.sections];
                        newSections[sectionIndex].video_url = e.target.value;
                        setFormData({ ...formData, sections: newSections });
                      }}
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
                      onChange={(e) => {
                        const newSections = [...formData.sections];
                        newSections[sectionIndex].duration = e.target.value;
                        setFormData({ ...formData, sections: newSections });
                      }}
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseManagement;