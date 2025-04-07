import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bot, Utensils, Calendar as CalendarSync, TrendingUp, AlertCircle, Calendar, Star, BarChart2, Leaf, DollarSign, Heart, Clock, Users, SearchCheck, ChefHat, Sandwich, X } from 'lucide-react';

const MenuPlanner = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);

  // Sample menu analysis data - will be replaced with real data
  const menuAnalysis = {
    nutritionalScore: 92,
    costPerMeal: 2.45,
    projectedWaste: 4.2,
    studentSatisfaction: 88,
    varietyScore: 85,
    sustainabilityScore: 78,
    trends: [
      { metric: 'Student Participation', trend: 'up', value: '+8%' },
      { metric: 'Food Cost', trend: 'down', value: '-3%' },
      { metric: 'Nutritional Balance', trend: 'up', value: '+5%' }
    ],
    recommendations: [
      'Consider adding more whole grain options to increase fiber content',
      'Projected participation suggests increasing production by 5%',
      'Current menu has good protein variety but could use more plant-based options'
    ],
    warnings: [
      'Sodium levels slightly above target in Week 2',
      'Limited vegetarian options in Week 3'
    ]
  };

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
            <div className="space-y-4">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                I've analyzed your menu plans for March and found some interesting insights. Your menus are showing strong nutritional balance with a score of {menuAnalysis.nutritionalScore}/100, and student satisfaction is trending upward. Here are the key findings:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menuAnalysis.trends.map((trend, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {trend.metric}
                      </span>
                      <span className={`text-sm font-medium ${
                        trend.trend === 'up'
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {trend.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Menu Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nutritional Balance
            </h2>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
              <Heart className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Overall Score
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {menuAnalysis.nutritionalScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${menuAnalysis.nutritionalScore}%` }}
                />
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Key Metrics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Protein</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>28g avg.</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fiber</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>8g avg.</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sodium</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>640mg avg.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Cost Analysis
            </h2>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
              <DollarSign className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cost Per Meal
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${menuAnalysis.costPerMeal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '82%' }}
                />
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Food</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>$1.85</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Labor</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>$0.45</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Other</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>$0.15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Student Satisfaction
            </h2>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-100'}`}>
              <Star className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Overall Rating
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {menuAnalysis.studentSatisfaction}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${menuAnalysis.studentSatisfaction}%` }}
                />
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Top Rated Items
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pizza</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tacos</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pasta</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>4.6/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <Leaf className={darkMode ? 'text-green-400' : 'text-green-600'} />
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sustainability
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Score</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {menuAnalysis.sustainabilityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${menuAnalysis.sustainabilityScore}%` }}
                />
              </div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Based on local sourcing, seasonal ingredients, and waste reduction metrics.
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <Clock className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Production Time
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Average Prep Time
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  45 min
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Based on recipe complexity and kitchen workflow analysis.
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <Users className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Dietary Accommodation
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Coverage</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  92%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Percentage of special dietary needs met by menu options.
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations and Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recommendations
          </h2>
          <div className="space-y-4">
            {menuAnalysis.recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <TrendingUp className={`w-5 h-5 mt-0.5 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Attention Needed
          </h2>
          <div className="space-y-4">
            {menuAnalysis.warnings.map((warning, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  darkMode ? 'text-amber-400' : 'text-amber-600'
                }`} />
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {warning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MenuPlanner;