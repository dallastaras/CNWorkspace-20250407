import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

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
}

interface CourseListProps {
  courses: Course[];
  onCreateCourse: () => void;
  onEditCourse: (courseId: string) => void;
  onTogglePublish: (courseId: string, isPublished: boolean) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  onCreateCourse,
  onEditCourse,
  onTogglePublish
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredCourses = courses.filter(course => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructor_name.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learning Courses
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Create and manage learning content
            </p>
          </div>
        </div>
        <button
          onClick={onCreateCourse}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Course
        </button>
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
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}
          >
            <div className="relative">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className={`w-full h-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <GraduationCap className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              )}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                course.is_published
                  ? darkMode 
                    ? 'bg-green-900/20 text-green-400'
                    : 'bg-green-100 text-green-800'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {course.is_published ? 'Published' : 'Draft'}
              </div>
            </div>

            <div className="p-6">
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.title}
              </h3>
              <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {course.description}
              </p>

              <div className="flex items-center space-x-4 mb-4">
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

              {course.duration && (
                <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  <Clock className="w-4 h-4 mr-2" />
                  {course.duration}
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => onTogglePublish(course.id, !course.is_published)}
                  className={`flex items-center px-3 py-1 rounded-md ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {course.is_published ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </button>
                <button
                  onClick={() => onEditCourse(course.id)}
                  className={`flex items-center px-3 py-1 rounded-md ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};