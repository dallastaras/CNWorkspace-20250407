import React from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  profile: {
    name: string;
    restrictions: string[];
  };
  lastMeal?: {
    date: string;
    type: 'breakfast' | 'lunch' | 'snack' | 'supper';
  };
}

interface StudentListProps {
  students: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Student
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                School
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Diet Profile
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Last Meal
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {students.map((student) => (
              <tr key={student.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Grade {student.grade}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {student.school}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {student.profile.name}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {student.profile.restrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.lastMeal ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {new Date(student.lastMeal.date).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {student.lastMeal.type.charAt(0).toUpperCase() + student.lastMeal.type.slice(1)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No meals today
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};