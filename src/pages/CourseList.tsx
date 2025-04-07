import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getLearningCourses, updateLearningCourse, getQuizAttempts } from '../lib/api';
import {
  GraduationCap, 
  Search, 
  Filter,
  Clock,
  Users,
  Play,
  Award,
  ChevronRight,
  Plus,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle
} from 'lucide-react';
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
  is_published: boolean;
  created_at: string;
  sections: any[];
  resources: any[];
  questions: any[];
  quizAttempts?: {
    score: number;
    passed: boolean;
    created_at: string;
  }[];
}

const CourseList = () => {
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'completed' | 'incomplete'>('all');

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

  const filteredCourses = courses.filter(course => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructor_name.toLowerCase().includes(searchLower);

    // Status filter
    const latestAttempt = course.quizAttempts?.[0];
    const isCompleted = latestAttempt?.passed;
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published) ||
      (filterStatus === 'completed' && isCompleted) ||
      (filterStatus === 'incomplete' && !isCompleted);

    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = async (courseId: string, isPublished: boolean) => {
    try {
      setLoading(true);
      await updateLearningCourse(courseId, { is_published: isPublished });
      const updatedCourses = await getLearningCourses();
      setCourses(user?.role === 'director' ? updatedCourses : updatedCourses.filter(c => c.is_published));
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

  if (error) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 text-center`}>
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 flex-1">
          <GraduationCap className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Available Courses
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Browse and take courses to enhance your skills
            </p>
          </div>
        </div>
        {user?.role === 'director' && (
          <button
            onClick={() => navigate('/learning/management?view=create')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>
        {user?.role === 'director' && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        )}
      </div>

      {/* Course List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="overflow-hidden">
          <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Course
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Instructor
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Duration
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Status
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
              darkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {filteredCourses.map((course) => (
                <tr 
                  key={course.id}
                  className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                  onClick={() => navigate(`/learning/courses/${course.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                            <GraduationCap className={`w-6 h-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {course.title}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                          {course.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {course.instructor_avatar_url ? (
                        <img
                          src={course.instructor_avatar_url}
                          alt={course.instructor_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                          <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                      )}
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {course.instructor_name}
                        </div>
                        {course.instructor_title && (
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {course.instructor_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration || 'Self-paced'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.quizAttempts?.length > 0
                          ? course.quizAttempts[0].passed
                            ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.quizAttempts?.length > 0 ? (
                          <>
                            {course.quizAttempts[0].passed ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {course.quizAttempts[0].passed ? 'Passed' : 'Failed'} ({course.quizAttempts[0].score}%)
                          </>
                        ) : (
                          'Not Started'
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {user?.role === 'director' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePublish(course.id, !course.is_published);
                            }}
                            className={`flex items-center px-3 py-1 rounded-md ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {course.is_published ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                Publish
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/learning/management?view=edit&id=${course.id}`);
                            }}
                            className={`flex items-center px-3 py-1 rounded-md ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learning/courses/${course.id}${course.quizAttempts?.length ? '#quiz' : ''}`);
                          }}
                          className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {course.quizAttempts?.length ? 'Continue' : 'Start'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseList;