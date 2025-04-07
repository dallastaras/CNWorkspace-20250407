import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FileText, 
  Video, 
  Link2, 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  List,
  HelpCircle,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';

interface Section {
  id?: string;
  title: string;
  content: string[];
  video_url?: string;
  duration?: string;
  order_index: number;
}

interface Resource {
  id?: string;
  title: string;
  description?: string;
  type: 'pdf' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
  order_index: number;
}

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

interface CourseEditorProps {
  courseId: string;
  sections: Section[];
  resources: Resource[];
  questions: Question[];
  onSave: (data: {
    sections: Section[];
    resources: Resource[];
    questions: Question[];
  }) => Promise<void>;
  onCancel: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  courseId,
  sections: initialSections,
  resources: initialResources,
  questions: initialQuestions,
  onSave,
  onCancel
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'sections' | 'resources' | 'quiz'>('sections');
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedResourceType, setSelectedResourceType] = useState<'video' | 'document' | 'link'>(
    initialResources?.[0]?.type || 'video'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSave({ sections, resources, questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course content');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        content: [''],
        order_index: sections.length
      }
    ]);
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addResource = () => {
    setResources([
      ...resources,
      {
        title: '',
        description: '',
        type: selectedResourceType,
        url: '',
        size: '',
        order_index: resources.length
      }
    ]);
  };

  const updateResource = (index: number, updates: Partial<Resource>) => {
    const newResources = [...resources];
    newResources[index] = { ...newResources[index], ...updates };
    setResources(newResources);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: Array(4).fill(''),
        correct_answer: 0,
        order_index: questions.length
      }
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <List className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Content
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
            onClick={handleSubmit}
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
                Save Changes
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

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'sections', label: 'Sections', icon: FileText },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'quiz', label: 'Quiz Questions', icon: HelpCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? `${darkMode 
                        ? 'border-indigo-400 text-indigo-400' 
                        : 'border-indigo-600 text-indigo-600'}`
                    : `${darkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sections' && (
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, { title: e.target.value })}
                      placeholder="Section Title"
                      className={`flex-1 px-3 py-2 rounded-lg mr-4 ${
                        darkMode
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-white text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                      onClick={() => removeSection(index)}
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                          : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
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
                            updateSection(index, { content: newContent });
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
                            updateSection(index, { content: newContent });
                          }}
                          className={`p-2 rounded-lg ${
                            darkMode
                              ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                              : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newContent = [...section.content, ''];
                        updateSection(index, { content: newContent });
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
                        onChange={(e) => updateSection(index, { video_url: e.target.value })}
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
                        onChange={(e) => updateSection(index, { duration: e.target.value })}
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
                onClick={addSection}
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
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setSelectedResourceType('video')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedResourceType === 'video'
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </button>
                <button
                  onClick={() => setSelectedResourceType('document')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedResourceType === 'document'
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Document
                </button>
                <button
                  onClick={() => setSelectedResourceType('link')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedResourceType === 'link'
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  External Link
                </button>
              </div>

              {resources.map((resource, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-4 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      {resource.type === 'video' && <Video className="w-5 h-5 text-indigo-600" />}
                      {resource.type === 'document' && <FileText className="w-5 h-5 text-indigo-600" />}
                      {resource.type === 'link' && <ExternalLink className="w-5 h-5 text-indigo-600" />}
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
                        onChange={(e) => updateResource(index, { title: e.target.value })}
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
                      onChange={(e) => updateResource(index, { description: e.target.value })}
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
                        {resource.type === 'video' ? 'Video URL' :
                         resource.type === 'document' ? 'Document URL' :
                         'External Link URL'}
                      </label>
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => updateResource(index, { url: e.target.value })}
                        placeholder={`Enter ${resource.type} URL`}
                        className={`w-full px-3 py-2 rounded-lg ${
                          darkMode
                            ? 'bg-gray-600 text-white border-gray-500'
                            : 'bg-white text-gray-900 border-gray-300'
                        } border focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                    {resource.type === 'document' && (
                      <div>
                        <label className={`block text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        } mb-1`}>
                          File Size
                        </label>
                        <input
                          type="text"
                          value={resource.size}
                          onChange={(e) => updateResource(index, { size: e.target.value })}
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
                      onClick={() => removeResource(index)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        darkMode
                          ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                          : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Resource
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addResource}
                className={`flex items-center px-4 py-2 ${
                  darkMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-lg`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Resource
              </button>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}>
                      Question
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-white text-gray-900 border-gray-300'
                      } border focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={question.correct_answer === optionIndex}
                          onChange={() => updateQuestion(index, { correct_answer: optionIndex })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optionIndex] = e.target.value;
                            updateQuestion(index, { options: newOptions });
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                          className={`flex-1 px-3 py-2 rounded-lg ${
                            darkMode
                              ? 'bg-gray-600 text-white border-gray-500'
                              : 'bg-white text-gray-900 border-gray-300'
                          } border focus:ring-2 focus:ring-indigo-500`}
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => {
                              const newOptions = question.options.filter((_, i) => i !== optionIndex);
                              updateQuestion(index, { options: newOptions });
                            }}
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                                : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 6 && (
                      <button
                        onClick={() => {
                          const newOptions = [...question.options, ''];
                          updateQuestion(index, { options: newOptions });
                        }}
                        className={`flex items-center px-4 py-2 ${
                          darkMode
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } rounded-lg`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => removeQuestion(index)}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        darkMode
                          ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                          : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Question
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addQuestion}
                className={`flex items-center px-4 py-2 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-lg`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};