import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { GraduationCap, Save, ArrowLeft } from 'lucide-react';
import { updateLearningCourse, getLearningCourses } from '../../lib/api';
import {
  BasicInfo,
  InstructorInfo,
  CourseContent,
  CourseResources,
  CourseQuiz,
  CourseSettings
} from './course-details';

interface Course {
  id: string;
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
  sys_course_module_mapping?: Array<{
    module_id: string;
    is_required: boolean;
    sys_modules: {
      id: string;
      name: string;
      description: string;
      sys_platforms: {
        name: string;
      };
    };
  }>;
}

export const CourseDetails: React.FC = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Course | null>(null);
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
  const [requiredModules, setRequiredModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        const courses = await getLearningCourses();
        const course = courses.find(c => c.id === courseId);
        
        if (!course) {
          throw new Error('Course not found');
        }

        // Initialize selected modules from existing mappings
        if (course.sys_course_module_mapping) {
          const modules: Record<string, boolean> = {};
          const required: Record<string, boolean> = {};
          course.sys_course_module_mapping.forEach(mapping => {
            modules[mapping.sys_modules.id] = true;
            required[mapping.sys_modules.id] = mapping.is_required;
          });
          setSelectedModules(modules);
          setRequiredModules(required);
        }

        setFormData(course);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      await updateLearningCourse(courseId!, {
        ...formData,
        modules: Object.entries(selectedModules)
          .filter(([_, isSelected]) => isSelected)
          .map(([moduleId]) => ({
            moduleId,
            isRequired: requiredModules[moduleId] || false
          }))
      });
      navigate('/learning/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner 
          size="lg" 
          className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
        />
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 text-center`}>
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          {error || 'Course not found'}
        </div>
        <button
          onClick={() => navigate('/learning/courses')}
          className={`mt-4 px-4 py-2 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } rounded-lg`}
        >
          Return to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Edit Course
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
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
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

      <form className="space-y-6">
        <BasicInfo
          title={formData.title}
          description={formData.description}
          thumbnailUrl={formData.thumbnail_url}
          duration={formData.duration}
          onUpdate={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />

        <InstructorInfo
          name={formData.instructor_name}
          title={formData.instructor_title}
          avatarUrl={formData.instructor_avatar_url}
          onUpdate={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />

        <CourseContent
          sections={formData.sections}
          onSectionChange={(index, updates) => {
            const newSections = [...formData.sections];
            newSections[index] = { ...newSections[index], ...updates };
            setFormData(prev => ({ ...prev, sections: newSections }));
          }}
          onAddSection={() => {
            setFormData(prev => ({
              ...prev,
              sections: [...prev.sections, { title: '', content: [''], video_url: '', duration: '' }]
            }));
          }}
          onRemoveSection={(index) => {
            setFormData(prev => ({
              ...prev,
              sections: prev.sections.filter((_, i) => i !== index)
            }));
          }}
        />

        <CourseResources
          resources={formData.resources}
          onResourceChange={(index, updates) => {
            const newResources = [...formData.resources];
            newResources[index] = { ...newResources[index], ...updates };
            setFormData(prev => ({ ...prev, resources: newResources }));
          }}
          onAddResource={() => {
            setFormData(prev => ({
              ...prev,
              resources: [...prev.resources, { title: '', description: '', type: 'pdf', url: '' }]
            }));
          }}
          onRemoveResource={(index) => {
            setFormData(prev => ({
              ...prev,
              resources: prev.resources.filter((_, i) => i !== index)
            }));
          }}
        />

        <CourseQuiz
          questions={formData.questions}
          onQuestionChange={(index, updates) => {
            const newQuestions = [...formData.questions];
            newQuestions[index] = { ...newQuestions[index], ...updates };
            setFormData(prev => ({ ...prev, questions: newQuestions }));
          }}
          onAddQuestion={() => {
            setFormData(prev => ({
              ...prev,
              questions: [...prev.questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]
            }));
          }}
          onRemoveQuestion={(index) => {
            setFormData(prev => ({
              ...prev,
              questions: prev.questions.filter((_, i) => i !== index)
            }));
          }}
        />

        <CourseSettings
          passingScore={formData.passing_score}
          isPublished={formData.is_published}
          onUpdate={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />
      </form>
    </div>
  );
};