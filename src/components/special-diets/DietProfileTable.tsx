import React from 'react';
import { useStore } from '../../store/useStore';
import { DietRecipeList } from './DietRecipeList';

interface DietProfile {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  restrictions: {
    id: string;
    ingredient: {
      name: string;
      description: string;
    };
    notes: string;
  }[];
  studentCount: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  nutrition_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  is_verified: boolean;
}

interface DietProfileTableProps {
  profiles: DietProfile[];
  onSelectProfile: (profile: DietProfile) => void;
  recipes?: Record<string, Recipe[]>;
}

export const DietProfileTable: React.FC<DietProfileTableProps> = ({ 
  profiles, 
  onSelectProfile,
  recipes = {}
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Profile Name
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Type
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Restrictions
              </th>
              <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Students
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {profiles.flatMap((profile) => [
              <tr 
                key={profile.id}
                className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                onClick={() => onSelectProfile(profile)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {profile.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-indigo-400/10 text-indigo-400' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {profile.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.restrictions.map((restriction) => (
                      <span
                        key={restriction.id}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {restriction.ingredient.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.studentCount}
                  </span>
                </td>
              </tr>,
              recipes[profile.id]?.length > 0 ? (
                <tr key={`${profile.id}-recipes`}>
                  <td colSpan={4} className="px-6 py-4">
                    <DietRecipeList recipes={recipes[profile.id]} />
                  </td>
                </tr>
              ) : null
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
};