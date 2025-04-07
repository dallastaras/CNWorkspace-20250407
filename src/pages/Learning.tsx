import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getLearningCourses, getQuizAttempts } from '../lib/api';
import { GraduationCap, ChevronRight, Play, Award, Clock, Users, Settings, Edit } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
  is_published: boolean;
  isRecommended: boolean;
  isRequired: boolean;
  quizAttempts?: {
    score: number;
    passed: boolean;
    created_at: string;
  }[];
}

const Learning = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'product' | 'industry' | 'compliance'>('product');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all courses
        const coursesData = await getLearningCourses();
        
        // Get quiz attempts for each course
        const coursesWithAttempts = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const attempts = await getQuizAttempts(course.id);
              return {
                ...course,
                quizAttempts: attempts
              };
            } catch (err) {
              console.error(`Failed to fetch attempts for course ${course.id}:`, err);
              return course;
            }
          })
        );
        
        // Show all courses for directors, only published for others
        setCourses(
          user?.role === 'director' 
            ? coursesWithAttempts 
            : coursesWithAttempts.filter(course => course.is_published)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.role]);

  // Get completed courses for badges
  const earnedBadges = courses
    .filter(course => course.quizAttempts?.some(attempt => attempt.passed))
    .map(course => ({
      icon: Award,
      name: `${course.title} Expert`,
      description: `Completed ${course.title} training`
    }));

  const handleModuleClick = (moduleId: string) => {
    navigate(`/learning/${moduleId}`);
  };

  const renderBadges = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Achievements
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {earnedBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className={`p-3 rounded-full ${
                darkMode ? 'bg-gray-600' : 'bg-white'
              } mb-3`}>
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className={`text-sm font-medium text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {badge.name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner 
            size="lg" 
            className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
          />
        </div>
      ) : error ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 text-center`}>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            {error}
          </div>
        </div>
      ) : courses.map((course) => (
        <div
          key={course.id}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden cursor-pointer`}
          onClick={() => navigate(`/learning/courses/${course.id}`)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 md:flex-shrink-0">
              <img
                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1280&h=720&fit=crop'}
                alt={course.title}
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                {course.isRequired && (
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
                  }`}>
                    Required
                  </div>
                )}
                {course.isRecommended && !course.isRequired && (
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Recommended
                  </div>
                )}
              </div>
              {course.isRequired && !course.quizAttempts?.some(a => a.passed) && (
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1 text-red-500" />
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Required Training
                  </span>
                </div>
              )}
              {course.quizAttempts?.length > 0 && (
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium ${
                  course.quizAttempts[0].passed
                    ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                    : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
                }`}>
                  {course.quizAttempts[0].passed ? 'Passed' : 'Failed'} ({course.quizAttempts[0].score}%)
                </div>
              )}
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-xl font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {course.title}
                  </h2>
                  <p className={`text-sm mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Clock className={`w-4 h-4 mr-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {course.duration || 'Self-paced'}
                  </span>
                </div>
                {course.quizAttempts?.length > 0 && (
                  <div className="flex items-center">
                    {course.quizAttempts[0].passed ? (
                      <Award className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <Award className="w-4 h-4 mr-1 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {course.quizAttempts[0].passed ? 'Completed' : 'Attempted'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/learning/courses/${course.id}/edit`);
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-500"
              >
                <span className="text-sm font-medium">
                  Edit Course
                </span>
                <Edit className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learning Center
            </h1>
          </div>
        </div>
        {user?.role === 'director' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/learning/courses')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Users className="w-5 h-5 mr-2" />
              View Courses
            </button>
            <button
              onClick={() => navigate('/learning/management')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Staff Progress
            </button>
            <button
              onClick={() => navigate('/learning/courses')}
              className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Manage Courses"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {earnedBadges.length > 0 && renderBadges()}

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'product', label: 'Learn the Product' },
            { id: 'industry', label: 'Learn the Industry' },
            { id: 'compliance', label: 'Learn Regulation' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
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
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'product' && renderModules()}
      {activeTab === 'industry' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Industry Learning
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Coming soon! Industry-specific learning content is being developed.
          </p>
        </div>
      )}
      {activeTab === 'compliance' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Compliance Learning
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Coming soon! Regulatory compliance learning content is being developed.
          </p>
        </div>
      )}
    </div>
  );
};

export default Learning;