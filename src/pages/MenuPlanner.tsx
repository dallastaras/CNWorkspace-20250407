import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bot, Utensils, Calendar as CalendarSync, ChefHat, BarChart2, ArrowRight, School } from 'lucide-react';
import TopTrendingItems from '../components/menu-planner/TopTrendingItems';
import SchoolPerformanceChart from '../components/menu-planner/SchoolPerformanceChart';
import { TimeframeSelector } from '../components/dashboard/TimeframeSelector';
import { SchoolSelector } from '../components/dashboard/SchoolSelector';

const MenuPlanner = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>('district');
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);
  const selectedSchoolTypes = useStore((state) => state.selectedSchoolTypes);
  const [schools, setSchools] = useState([
    { id: 'district', name: 'All Schools' },
    { id: '1', name: 'Cybersoft High' },
    { id: '2', name: 'Cybersoft Middle' },
    { id: '3', name: 'Cybersoft Elementary' },
    { id: '4', name: 'Primero High' },
    { id: '5', name: 'Primero Elementary' }
  ]);

  // Sample data - in a real app, this would come from an API
  const activeMenuItems = 85;
  const schoolsServingMenus = 5;
  const [schoolPerformance, setSchoolPerformance] = useState({
    total: 5,
    belowExpectation: 1,
    meetingExpectation: 2,
    exceedingExpectation: 2
  });

  // Generate dynamic text based on selected school and timeframe
  const getMenuItemsText = () => {
    const schoolText = selectedSchool === 'district' 
      ? 'all schools' 
      : schools.find(s => s.id === selectedSchool)?.name || 'selected school';
    
    let timeframeText;
    switch (selectedTimeframe) {
      case 'day':
        timeframeText = 'today';
        break;
      case 'prior-day':
        timeframeText = 'yesterday';
        break;
      case 'week':
        timeframeText = 'this week';
        break;
      case 'last-week':
        timeframeText = 'last week';
        break;
      case 'month':
        timeframeText = 'this month';
        break;
      case 'last-month':
        timeframeText = 'last month';
        break;
      case 'year':
        timeframeText = 'this academic year';
        break;
      case 'prior-year':
        timeframeText = 'last academic year';
        break;
      case 'all-years':
        timeframeText = 'all time';
        break;
      case 'custom':
        timeframeText = 'selected period';
        break;
      default:
        timeframeText = 'the 2024-2025 school year';
    }
    
    return `${activeMenuItems} items currently active on menus for ${schoolText} ${timeframeText}`;
  };

  // Generate dynamic text for schools serving menus
  const getSchoolsText = () => {
    let timeframeText;
    switch (selectedTimeframe) {
      case 'day':
        timeframeText = 'today';
        break;
      case 'prior-day':
        timeframeText = 'yesterday';
        break;
      case 'week':
        timeframeText = 'this week';
        break;
      case 'last-week':
        timeframeText = 'last week';
        break;
      case 'month':
        timeframeText = 'this month';
        break;
      case 'last-month':
        timeframeText = 'last month';
        break;
      case 'year':
        timeframeText = 'this academic year';
        break;
      case 'prior-year':
        timeframeText = 'last academic year';
        break;
      case 'all-years':
        timeframeText = 'all time';
        break;
      case 'custom':
        timeframeText = 'selected period';
        break;
      default:
        timeframeText = 'the 2024-2025 school year';
    }
    
    return `${schoolsServingMenus} schools currently serving menus for ${timeframeText}`;
  };

  // Generate dynamic text for school performance
  const getSchoolPerformanceText = () => {
    // For a specific school
    if (selectedSchool !== 'district') {
      const schoolName = schools.find(s => s.id === selectedSchool)?.name || 'Selected school';
      
      // Determine performance based on school ID (in a real app, this would come from actual data)
      let performance;
      switch (selectedSchool) {
        case '1': // Cybersoft High
        case '3': // Cybersoft Elementary
          performance = 'exceeding expectation';
          break;
        case '2': // Cybersoft Middle
        case '5': // Primero Elementary
          performance = 'meeting expectation';
          break;
        case '4': // Primero High
          performance = 'below expectation';
          break;
        default:
          performance = 'performing as expected';
      }
      
      // Get timeframe text
      let timeframeText;
      switch (selectedTimeframe) {
        case 'day':
          timeframeText = 'today';
          break;
        case 'prior-day':
          timeframeText = 'yesterday';
          break;
        case 'week':
          timeframeText = 'this week';
          break;
        case 'last-week':
          timeframeText = 'last week';
          break;
        case 'month':
          timeframeText = 'this month';
          break;
        case 'last-month':
          timeframeText = 'last month';
          break;
        case 'year':
          timeframeText = 'this academic year';
          break;
        default:
          timeframeText = 'currently';
      }
      
      return `${schoolName} is ${performance} ${timeframeText}`;
    }
    
    // For all schools
    const { total, belowExpectation, meetingExpectation, exceedingExpectation } = schoolPerformance;
    
    // Get timeframe text
    let timeframeText;
    switch (selectedTimeframe) {
      case 'day':
        timeframeText = 'today';
        break;
      case 'prior-day':
        timeframeText = 'yesterday';
        break;
      case 'week':
        timeframeText = 'this week';
        break;
      case 'last-week':
        timeframeText = 'last week';
        break;
      case 'month':
        timeframeText = 'this month';
        break;
      case 'last-month':
        timeframeText = 'last month';
        break;
      case 'year':
        timeframeText = 'this academic year';
        break;
      default:
        timeframeText = 'currently';
    }
    
    if (belowExpectation === 0) {
      return `All schools are performing as expected ${timeframeText}`;
    } else if (belowExpectation === total) {
      return `All schools are performing below expectation ${timeframeText}`;
    } else {
      return `${total - belowExpectation} of ${total} schools are performing at or above expectation ${timeframeText}`;
    }
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
  };

  // Filter schools based on selected school types
  const filteredSchools = useMemo(() => {
    if (selectedSchoolTypes.length === 0) return schools;
    
    return schools.filter(school => {
      // Always include the district option
      if (school.id === 'district') return true;
      
      const name = school.name.toLowerCase();
      return (
        (selectedSchoolTypes.includes('elementary') && name.includes('elementary')) ||
        (selectedSchoolTypes.includes('middle') && name.includes('middle')) ||
        (selectedSchoolTypes.includes('high') && name.includes('high')) ||
        (selectedSchoolTypes.includes('k8') && name.includes('k8')) ||
        (selectedSchoolTypes.includes('k12') && name.includes('k12'))
      );
    });
  }, [schools, selectedSchoolTypes]);
  
  // Update selected school if it's filtered out
  useEffect(() => {
    if (selectedSchool !== 'district' && !filteredSchools.find(s => s.id === selectedSchool)) {
      setSelectedSchool('district');
    }
  }, [filteredSchools, selectedSchool]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Utensils className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Menu Analysis
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <TimeframeSelector />
          <SchoolSelector
            selectedSchool={selectedSchool}
            schools={filteredSchools}
            onSchoolChange={handleSchoolChange}
          />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                <Utensils className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div className="space-y-2">
                <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Menu Items
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getMenuItemsText()}
                </p>
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
          </div>
        </div>
          
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                <School className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div className="space-y-2">
                <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  School Performance
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getSchoolPerformanceText()}
                </p>
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
          </div>
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
      <TopTrendingItems selectedSchool={selectedSchool} />
      
      {/* School Performance Chart */}
      <SchoolPerformanceChart 
        selectedSchool={selectedSchool} 
        filteredSchoolTypes={selectedSchoolTypes}
      />
    </div>
  );
};

export default MenuPlanner;