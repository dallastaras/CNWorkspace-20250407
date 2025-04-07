import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getLearningCourses } from '../lib/api';
import { 
  Play,
  FileText,
  CheckCircle2,
  Lock,
  Award,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Video,
  BarChart2,
  Download,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Clock,
  Users
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
//import { Quiz } from '../components/learning/Quiz';

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
  sections: {
    title: string;
    content: string[];
    video_url?: string;
    duration?: string;
  }[];
  resources: {
    title: string;
    description: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
  }[];
  questions: {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
  }[];
  passing_score: number;
  is_published: boolean;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'resources' | 'quiz'>('overview');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentSection = course?.sections ? 
    Array.isArray(course.sections) ? course.sections[currentSectionIndex] : 
    (course.sections as any)[currentSectionIndex] : null;
  const videoUrl = currentSection?.video_url;

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        const courses = await getLearningCourses();
        const foundCourse = courses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          throw new Error('Course not found');
        }

        // Parse JSON fields if they're stored as strings
        const parsedCourse = {
          ...foundCourse,
          sections: foundCourse.sections ? 
            (typeof foundCourse.sections === 'string' ? 
              JSON.parse(foundCourse.sections) : foundCourse.sections) : [],
          resources: foundCourse.resources ?
            (typeof foundCourse.resources === 'string' ? 
              JSON.parse(foundCourse.resources) : foundCourse.resources) : [],
          questions: foundCourse.questions ?
            (typeof foundCourse.questions === 'string' ? 
              JSON.parse(foundCourse.questions) : foundCourse.questions) : [],
          objectives: foundCourse.objectives || [],
          prerequisites: foundCourse.prerequisites || []
        };

        setCourse(parsedCourse);

      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

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

  if (error || !course) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 text-center`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${
          darkMode ? 'text-red-400' : 'text-red-600'
        }`} />
        <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {error || 'Course not found'}
        </h2>
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

  const handleQuizComplete = (passed: boolean, score: number) => {
    setQuizCompleted(true);
    setQuizScore(score);
  };

  const renderVideoSection = () => (
    <div className="space-y-6">
      <div className="relative pt-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
        {!videoPlaying ? (
          <>
            <img
              src={course.thumbnail_url || videoUrl || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1280&h=720&fit=crop'}
              alt="Course thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button 
                onClick={() => setVideoPlaying(true)}
                className="p-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            </div>
          </>
        ) : videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <span className="text-gray-500">Video player would be here</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className={`col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Content
          </h2>
          <div className="space-y-4">
            {course.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSectionIndex(index);
                  setVideoPlaying(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg ${
                  currentSectionIndex === index
                    ? darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`w-8 h-8 rounded-full ${
                  darkMode ? 'bg-gray-600' : 'bg-white'
                } flex items-center justify-center mr-3`}>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h3>
                  {section.duration && (
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {section.duration}
                    </p>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </button>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Progress
          </h2>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Completion
                </span>
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  0%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                <div className="w-0 h-2 rounded-full bg-indigo-600" />
              </div>
            </div>

            {quizCompleted ? (
              <div className={`p-4 rounded-lg ${
                quizScore >= course.passing_score
                  ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                  : darkMode ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {quizScore >= course.passing_score ? (
                    <CheckCircle2 className={`w-5 h-5 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`} />
                  )}
                  <span className={`text-sm font-medium ${
                    quizScore >= course.passing_score
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    Quiz Score: {quizScore}%
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Take Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About This Course
          </h2>
          <p className={`text-sm mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {course.description}
          </p>
          
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Learning Objectives
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {course.objectives.map((objective, index) => (
              <li
                key={index}
                className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {objective}
              </li>
            ))}
          </ul>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <>
              <h3 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Prerequisites
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {course.prerequisites.map((prerequisite, index) => (
                  <li
                    key={index}
                    className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {prerequisite}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Course Content
          </h2>
          <div className="space-y-4">
            {course.sections.map((section, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <div className="flex items-center space-x-4 mb-6">
            {course.instructor_avatar_url ? (
              <img
                src={course.instructor_avatar_url}
                alt={course.instructor_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className={`w-16 h-16 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } flex items-center justify-center`}>
                <Users className={`w-8 h-8 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
            )}
            <div>
              <h3 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {course.instructor_name}
              </h3>
              {course.instructor_title && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {course.instructor_title}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className={`flex items-center space-x-2 text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{course.duration || 'Self-paced'}</span>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Award className="w-4 h-4" />
              <span>Certificate upon completion</span>
            </div>
          </div>
        </div>

        {course.resources.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
            <h2 className={`text-lg font-medium mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Resources
            </h2>
            <div className="space-y-4">
              {course.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start p-3 rounded-lg ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } mr-3`}>
                    {resource.type === 'pdf' ? (
                      <FileText className="w-5 h-5 text-indigo-600" />
                    ) : resource.type === 'video' ? (
                      <Video className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {resource.title}
                    </h3>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {resource.description}
                    </p>
                    {resource.size && (
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {resource.size}
                      </span>
                    )}
                  </div>
                  <Download className={`w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/learning/courses')}
          className={`flex items-center space-x-2 ${
            darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {course.duration || 'Self-paced'}
            </span>
          </div>
          {quizCompleted ? (
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Completed
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                In Progress
              </span>
            </div>
          )}
        </div>
      </div>

      {renderVideoSection()}

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mt-6`}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'content', label: 'Course Content', icon: FileText },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'quiz', label: 'Quiz', icon: BarChart2 }
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
          {activeTab === 'overview' && renderOverviewSection()}
          {activeTab === 'quiz' && (
            <Quiz
              courseId={course.id}
              questions={course.questions}
              passingScore={course.passing_score}
              onComplete={handleQuizComplete}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;