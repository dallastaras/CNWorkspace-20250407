import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bot, Utensils, Calendar as CalendarSync, ChefHat, BarChart2, ArrowRight, School } from 'lucide-react';
import TopTrendingItems from '../components/menu-planner/TopTrendingItems';
import SchoolPerformanceChart from '../components/menu-planner/SchoolPerformanceChart';

const MenuPlanner = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);

  // Sample data - in a real app, this would come from an API
  const activeMenuItems = 85;
  const schoolsServingMenus = 5;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Utensils className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Menu Analysis
            </h1>
            {/*<p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Deep menu analysis and optimization
            </p>*/}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          
          <button
            onClick={() => navigate('/menu-planner/items')}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <ChefHat className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/menu-planner/cycles/list')}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <CalendarSync className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSchoolieInsights(!showSchoolieInsights)}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            <Bot className="w-5 h-5" />
          </button>
          
          {/*
          <button
            onClick={() => navigate('/menu-planner/cycles')}
            className={`flex items-center px-4 py-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            
            <Calendar className="w-5 h-5 mr-2" />
            View Calendar
          </button>
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            Run Analysis
          </button>
          */}
        </div>
      </div>

      {/* Active Menu Items Card */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <Utensils className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Active Menu Items
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeMenuItems} items currently active on menus for the 2024-2025 school year
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/menu-planner/items')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            Item Performance
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Schoolie's Analysis */}
      {showSchoolieInsights && (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              I've analyzed your menu plans and found that Turkey Tacos are your top performing item with 85% participation rate. Cybersoft Elementary has the lowest waste at 2.6% and highest production accuracy at 97.4%. Primero High needs attention with 12.6% waste and significant overproduction.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Menu Performance Metrics */}
      <TopTrendingItems />
      
      {/* Schools Serving Menus Card */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <School className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Schools Serving Menus
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {schoolsServingMenus} schools currently serving menus for the 2024-2025 school year
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/menu-planner/cycles/list')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            School Performance
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
      
      {/* School Performance Chart */}
      <SchoolPerformanceChart />
    </div>
  );
};

export default MenuPlanner;