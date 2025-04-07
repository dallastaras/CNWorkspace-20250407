import React from 'react';
import { useStore } from '../../store/useStore';
import { Utensils, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

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

interface DietRecipeListProps {
  recipes: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const DietRecipeList: React.FC<DietRecipeListProps> = ({
  recipes,
  onSelectRecipe
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'entree':
        return darkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-700 bg-blue-100';
      case 'side':
        return darkMode ? 'text-green-400 bg-green-400/10' : 'text-green-700 bg-green-100';
      case 'breakfast':
        return darkMode ? 'text-amber-400 bg-amber-400/10' : 'text-amber-700 bg-amber-100';
      case 'snack':
        return darkMode ? 'text-purple-400 bg-purple-400/10' : 'text-purple-700 bg-purple-100';
      default:
        return darkMode ? 'text-gray-400 bg-gray-400/10' : 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Available Menu Items
          </h2>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {recipes.length} items
          </span>
        </div>

        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 cursor-pointer hover:bg-opacity-75`}
              onClick={() => onSelectRecipe?.(recipe)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {recipe.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      getCategoryColor(recipe.category)
                    }`}>
                      {recipe.category}
                    </span>
                    {recipe.is_verified && (
                      <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    )}
                  </div>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {ingredient.name}
                  </span>
                ))}
              </div>

              {recipe.nutrition_info && (
                <div className="mt-3 flex items-center space-x-4 text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {recipe.nutrition_info.calories} cal
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {recipe.nutrition_info.protein}g protein
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {recipe.nutrition_info.carbs}g carbs
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {recipe.nutrition_info.fat}g fat
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};