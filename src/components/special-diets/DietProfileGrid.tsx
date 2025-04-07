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

interface DietProfileGridProps {
  profiles: DietProfile[];
  onSelectProfile: (profile: DietProfile) => void;
  recipes?: Record<string, Recipe[]>;
}

export const DietProfileGrid: React.FC<DietProfileGridProps> = ({ 
  profiles, 
  onSelectProfile,
  recipes = {}
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden cursor-pointer`}
          onClick={() => onSelectProfile(profile)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-indigo-400/10 text-indigo-400' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {profile.category.name}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {profile.description}
                </p>
              </div>
              <div className={`flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {profile.studentCount} students
              </div>
            </div>

            <div className="mt-4">
              <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Restrictions
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.restrictions.map((restriction) => (
                  <span
                    key={restriction.id}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    title={restriction.ingredient.description}
                  >
                    {restriction.ingredient.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Recipes */}
            {recipes[profile.id]?.length > 0 && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <DietRecipeList recipes={recipes[profile.id]} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};