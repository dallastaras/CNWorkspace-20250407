import React from 'react';
import { useStore } from '../../store/useStore';
import { Heart, DollarSign, Users } from 'lucide-react';

interface MenuAnalyticsProps {
  analysis: any; // Replace with proper type
}

const MenuAnalytics: React.FC<MenuAnalyticsProps> = ({ analysis }) => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Nutritional Balance
          </h2>
          <Heart className={darkMode ? 'text-green-400' : 'text-green-600'} />
        </div>
        {/* Add nutritional metrics */}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cost Analysis
          </h2>
          <DollarSign className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        {/* Add cost metrics */}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Student Satisfaction
          </h2>
          <Users className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
        </div>
        {/* Add satisfaction metrics */}
      </div>
    </div>
  );
};

export default MenuAnalytics;