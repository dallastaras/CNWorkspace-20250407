import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CourseList } from '../components/learning/CourseList';
import { CourseForm } from '../components/learning/CourseForm';
import { CourseEditor } from '../components/learning/CourseEditor';
import { getLearningCourses, createLearningCourse, updateLearningCourse } from '../lib/api';
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
  sections?: any[];
  resources?: any[];
  questions?: any[];
}

const LearningManagement = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLearningCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = async (courseData: any) => {
    try {
      setLoading(true);
      setError(null);
      await createLearningCourse(courseData);
      const updatedCourses = await getLearningCourses();
      setCourses(updatedCourses);
      setView('list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setView('edit');
    }
  };

  const handleUpdateCourse = async (courseData: any) => {
    try {
      setLoading(true);
      setError(null);
      await updateLearningCourse(selectedCourse!.id, courseData);
      const updatedCourses = await getLearningCourses();
      setCourses(updatedCourses);
      setView('list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId: string, isPublished: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await updateLearningCourse(courseId, { is_published: isPublished });
      const updatedCourses = await getLearningCourses();
      setCourses(updatedCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course status');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !courses.length) {
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

  if (view === 'create') {
    return (
      <CourseForm
        onSubmit={handleCreateCourse}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedCourse) {
    return (
      <CourseEditor
        courseId={selectedCourse.id}
        sections={selectedCourse.sections || []}
        resources={selectedCourse.resources || []}
        questions={selectedCourse.questions || []}
        onSave={async (data) => {
          await updateLearningCourse(selectedCourse.id, {
            ...selectedCourse,
            ...data
          });
          setView('list');
        }}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <CourseList
      courses={courses}
      onCreateCourse={() => setView('create')}
      onEditCourse={handleEditCourse}
      onTogglePublish={handleTogglePublish}
    />
  );
};

export default LearningManagement;