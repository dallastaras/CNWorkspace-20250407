import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  List,
  CalendarDays,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ChevronLeft,
  ChevronRight,
  Utensils,
  BarChart2,
  Heart,
  DollarSign,
  Settings,
  Users,
  School,
  SearchCheck
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { MenuCycleAnalysis } from '../components/menu-planner/MenuCycleAnalysis';
import { MenuCycleSelector } from '../components/menu-planner/MenuCycleSelector';
import { MenuCycleSettings } from '../components/menu-planner/MenuCycleSettings';
import { DailyMenuAnalysis } from '../components/menu-planner/DailyMenuAnalysis';

interface MenuCycle {
  id: string;
  name: string;
  program: string;
  mealPattern: string;
  audience: string;
  length: string;
  score: number;
  startDate: string;
  endDate: string;
}

interface MenuScore {
  compliance: number;
  performance: number;
  cost: number;
  overall: number;
}

interface DayMenu {
  date: Date;
  score: MenuScore;
  mainDish: string | string[];
  sideDishes: string[];
  warnings?: string[];
  strengths?: string[];
}

const MenuCycles = () => {
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const location = useLocation();
  const [cycleStart, setCycleStart] = useState(
    location.state?.startDate ? new Date(location.state.startDate) : new Date('2025-02-01')
  );
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<MenuCycle | null>(
    location.state?.selectedCycle || null
  );
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    showScore: true,
    showItems: false,
    showStrengths: false,
    showWarnings: false,
    showCompliance: true,
    showPerformance: true,
    showCost: true,
    useGradeScores: true
  });

  // Sample analysis data - will be replaced with real data
  const cycleAnalysis = {
    program: 'NSLP (Lunch)',
    length: '4 Weeks',
    audience: 'High Schools',
    planned_meals: 12500, // Total planned meals for the cycle
    composition: {
      grade: 'A',
      popularity: 90,
      variety: 85
    },
    cost: {
      grade: 'C',
      food: 'High',
      labor: 'Moderate'
    },
    participation: {
      grade: 'A',
      expected: 71,
      average: 67,
      difference: 4
    },
    score: {
      grade: 'A'
    }
  };

  // Sample data - will be replaced with real data
  const getMenuData = (date: Date): DayMenu => {
    const dayOfWeek = date.getDay();
    const weekNumber = Math.floor((date.getTime() - cycleStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // Add expected scores for comparison
    const addExpectedScores = (menu: DayMenu) => ({
      ...menu,
      expected: {
        compliance: 90,
        performance: 85,
        cost: 88,
        overall: 88
      }
    });
    
    // Add some lower scores in week 2
    if (weekNumber === 1) {
      const menus: Record<number, DayMenu> = {
        1: {
          date,
          score: {
            compliance: 65,
            performance: 58,
            cost: 72,
            overall: 65
          },
          mainDish: ['Fish Sticks','Lasagna','Sloppy Joes','Chicken Sandwich'],
          //sideDishes: ['Brown Rice', 'Steamed Carrots', 'Whole Grain Roll'],
          warnings: ['Low student acceptance', 'High food waste projected']
        },
        3: {
          date,
          score: {
            compliance: 72,
            performance: 68,
            cost: 75,
            overall: 72
          },
          mainDish: ['Vegetable Stir Fry','Protein Power Bowl','Chicken Nuggets','Corn Dog'],
          //sideDishes: ['Brown Rice', 'Spring Rolls', 'Fortune Cookie'],
          warnings: ['Below average participation expected', 'Consider menu adjustments']
        },
        5: {
          date,
          score: {
            compliance: 95,
            performance: 62,
            cost: 68,
            overall: 75
          },
          mainDish: ['Garden Salad Bar','BLT Sandwich','Calzones','Pizza','Pizza Bites'],
          //sideDishes: ['Whole Grain Crackers', 'Mixed Fruit', 'Low-fat Dressing'],
          warnings: ['Similar items competing', 'High prep time']
        }
      };
      
      if (menus[dayOfWeek]) {
        return addExpectedScores(menus[dayOfWeek]);
      }
    }
    
    const menus: Record<number, DayMenu> = {
      1: {
        date,
        score: {
          compliance: 95,
          performance: 88,
          cost: 92,
          overall: 92
        },
        mainDish: ['Spaghetti & Meatballs', 'Baked Chicken', 'Grilled Cheese','Beef Sliders','Turkey Wrap'],
        //sideDishes: ['Roasted Potatoes', 'Steamed Broccoli', 'Whole Grain Roll'],
        strengths: ['Popular items','Low waste']
        //warnings: ['Slightly above sodium target']
      },
      2: {
        date,
        score: {
          compliance: 98,
          performance: 85,
          cost: 90,
          overall: 91
        },
        mainDish: ['Spaghetti & Meatballs','Steak Fingers','Chicken Nuggets','Pizza'],
        //sideDishes: ['Garden Salad', 'Garlic Bread', 'Fresh Fruit'],
        strengths: ['Excellent menu variety']
      },
      3: {
        date,
        score: {
          compliance: 92,
          performance: 94,
          cost: 88,
          overall: 91
        },
        mainDish: ['Turkey Tacos','Chicken Nachos','Frito Pie','Hotdog'],
        //sideDishes: ['Spanish Rice', 'Refried Beans', 'Mexican Corn'],
        strengths: ['Student favorite']
      },
      4: {
        date,
        score: {
          compliance: 90,
          performance: 86,
          cost: 94,
          overall: 90
        },
        mainDish: ['Grilled Cheese', 'Baked Chicken', 'Cuban Sandwich','Beef Sliders'],
        //sideDishes: ['Tomato Soup', 'Baby Carrots', 'Apple Slices'],
        warnings: ['Similar item types']
      },
      5: {
        date,
        score: {
          compliance: 94,
          performance: 92,
          cost: 91,
          overall: 92
        },
        mainDish: ['Pizza', 'Baked Chicken', 'Grilled Cheese','Beef Sliders'],
        //sideDishes: ['Caesar Salad', 'Green Beans', 'Peaches'],
        strengths: ['High participation','Low prep time']
      }
    };

    return addExpectedScores(menus[dayOfWeek] || {
      date,
      score: {
        compliance: 0,
        performance: 0,
        cost: 0,
        overall: 0
      },
      mainDish: 'No menu planned',
      sideDishes: []
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return {
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-400/10' : 'bg-green-100'
    };
    if (score >= 80) return {
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      bg: darkMode ? 'bg-blue-400/10' : 'bg-blue-100'
    };
    if (score >= 50) return {
      text: darkMode ? 'text-amber-400' : 'text-amber-600',
      bg: darkMode ? 'bg-amber-400/10' : 'bg-amber-100'
    };
    return {
      text: darkMode ? 'text-red-400' : 'text-red-600',
      bg: darkMode ? 'bg-red-400/10' : 'bg-red-100'
    };
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const formatScore = (score: number) => {
    return displaySettings.useGradeScores ? getGradeFromScore(score) : `${score}%`;
  };
  // Generate 4 weeks of days
  const weeks = Array.from({ length: 4 }, (_, weekIndex) => {
    const weekStart = startOfWeek(addWeeks(cycleStart, weekIndex), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
      .filter(date => date.getDay() !== 0 && date.getDay() !== 6); // Exclude weekends
  });

  const navigateCycle = (direction: 'prev' | 'next') => {
    setCycleStart(current => 
      direction === 'next' ? addWeeks(current, 4) : subWeeks(current, 4)
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/menu-planner/cycles/list')} 
        className={`flex items-center text-sm ${
          darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to Menu Cycles</span>
      </button>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Calendar className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedCycle?.name || 'February 2025 Menu Cycle'}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedCycle?.program || 'NSLP (Lunch)'} • {selectedCycle?.mealPattern || 'K-12 Meal Pattern'}
            </p>
            {/*
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
              <CalendarDays className="w-4 h-4 mr-1" />
              {format(cycleStart, 'MMMM d')} - {format(addWeeks(cycleStart, 3), 'MMMM d, yyyy')}
            </p>
            */}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/*<button
            onClick={() => setIsSelectorOpen(true)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title="Select Menu Cycle"
          >
            <List className="w-5 h-5" />
          </button>
          */}

          <button
            onClick={() => setIsAnalysisOpen(true)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title="View Analysis"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/menu-planner/cycles/${selectedCycle?.id}/schools`, {
                state: { selectedCycle }
              });
            }}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title="View School Analysis"
          >
            <School className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSchoolieInsights(!showSchoolieInsights)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title={showSchoolieInsights ? 'Hide Schoolie' : 'Show Schoolie'}
          >
            <Bot className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title="Display Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {/*
          <button
            onClick={() => navigateCycle('prev')}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateCycle('next')}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          */}
        </div>
      </div>

      {/* Weekly Overview */}
      {showSchoolieInsights && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed p-2`}>
                <span className={`font-bold`}>Prediction: </span>This menu cycle is predicted to perform well on 3 out of 4 weeks with an average score of 91.2 (A). Week 3 has been assigned a grade of C due to multiple days with poor planning strategy, high waste possibilities, and low participation expected. This could impact your cycle performance overall. Weeks 1, 2, and 4 show good menu variety balance and cost efficiency. Student participation is projected to be strong on these weeks, particularly for Turkey Tacos on Wednesday. 
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed p-2`}>
                <span className={`font-bold`}>Recommendation: </span>It is recommended to potentially increase your production count for the turkey tacos as 100% partcipation is expcted. 
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed p-2`}>
                <span className={`font-bold`}>Actual: </span>Week 1 of the cycle has proven to be strong for all schools with high participatio and minimal waste. This follows our prediction and should continue for week 2. 
              </p>
              {/*
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Compliance
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(94).text}`}>
                      {displaySettings.useGradeScores ? getGradeFromScore(94) : '94%'}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Performance
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(89).text}`}>
                      {displaySettings.useGradeScores ? getGradeFromScore(89) : '89%'}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Cost Efficiency
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(91).text}`}>
                      {displaySettings.useGradeScores ? getGradeFromScore(91) : '91%'}
                    </span>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
      )}

      {/* Menu Cycle Summary */}
      {selectedCycle && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="grid grid-cols-5 gap-6">
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Program
              </h3>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCycle.program}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Meal Pattern
              </h3>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCycle.mealPattern}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Audience
              </h3>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCycle.audience}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Length
              </h3>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCycle.length}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Score
              </h3>
              <p className={`text-sm font-medium ${getScoreColor(selectedCycle.score).text}`}>
                {displaySettings.useGradeScores ? getGradeFromScore(selectedCycle.score) : `${selectedCycle.score}%`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="space-y-6">
        {weeks.map((weekDays, weekIndex) => (
          <div 
            key={weekIndex}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Week {weekIndex + 1}
                  </h3>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(weekDays[0], 'MMMM d')} - {format(weekDays[4], 'MMMM d')}
                  </div>
                </div>
                <div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getScoreColor(
                      weekDays.reduce((sum, day) => sum + getMenuData(day).score.overall, 0) / weekDays.length
                    ).bg
                  }`}>
                    <span className={`text-lg font-bold ${
                      getScoreColor(
                        weekDays.reduce((sum, day) => sum + getMenuData(day).score.overall, 0) / weekDays.length
                      ).text
                    }`}>
                      {formatScore(
                        weekDays.reduce((sum, day) => sum + getMenuData(day).score.overall, 0) / weekDays.length
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-gray-700">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
            <div
              key={day}
              className={`flex justify-between items-center px-4 py-2 ${
                darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}
            >
              <span className="text-md font-medium">{day}</span>
              <span className="text-md font-medium">{format(weekDays[0], 'd')}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-gray-700">
          {weekDays.map((day) => {
            const menu = getMenuData(day);
            return ( 
              <div
                key={day.toString()}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mt-3 mb-3">
                    <h3 className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Score
                    </h3>
                    {displaySettings.showScore && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getScoreColor(menu.score.overall).bg}`}>
                        <span className={`font-bold ${getScoreColor(menu.score.overall).text}`}>
                        {formatScore(menu.score.overall)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    {displaySettings.showCompliance && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <SearchCheck className={`w-4 h-4 mr-1 ${getScoreColor(menu.score.compliance).text}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Composition</span>
                        </div>
                        <span className={`font-medium ${getScoreColor(menu.score.compliance).text}`}>
                          {formatScore(menu.score.compliance)}
                        </span>
                      </div>
                    )}
                    {displaySettings.showPerformance && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <BarChart2 className={`w-4 h-4 mr-1 ${getScoreColor(menu.score.performance).text}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Performance</span>
                        </div>
                        <span className={`font-medium ${getScoreColor(menu.score.performance).text}`}>
                          {formatScore(menu.score.performance)}
                        </span>
                      </div>
                    )}
                    {displaySettings.showCost && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <DollarSign className={`w-4 h-4 mr-1 ${getScoreColor(menu.score.cost).text}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Cost</span>
                        </div>
                        <span className={`font-medium ${getScoreColor(menu.score.cost).text}`}>
                          {formatScore(menu.score.cost)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {displaySettings.showItems && (
                      <>
                        <h3 className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Menu Items
                        </h3>
                        <ul className={`text-xs space-y-1 mb-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {Array.isArray(menu.mainDish) ? menu.mainDish.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          )) : <li>{menu.mainDish}</li>}
                        </ul>
                      </>
                    )}

                    <div className="space-y-2">
                      {displaySettings.showStrengths && menu.strengths?.map((strength, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs"
                        >
                          <CheckCircle2 className={`w-3 h-3 mr-1 ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {strength}
                          </span>
                        </div>
                      ))}
                      {displaySettings.showWarnings && menu.warnings?.map((warning, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs"
                        >
                          <AlertTriangle className={`w-3 h-3 mr-1 ${
                            darkMode ? 'text-amber-400' : 'text-amber-600'
                          }`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {warning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div> 
            );
          })}
          </div>
        </div>
      ))}
      </div>

      <MenuCycleAnalysis
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        cycleData={cycleAnalysis}
      />

      <MenuCycleSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={displaySettings}
        onSettingChange={(setting) => setDisplaySettings(prev => ({
          ...prev,
          [setting]: !prev[setting]
        }))}
      />

      {selectedDay && (
        <DailyMenuAnalysis
          isOpen={selectedDay !== null}
          onClose={() => setSelectedDay(null)}
          date={selectedDay}
          menu={getMenuData(selectedDay)}
        />
      )}

      <MenuCycleSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectCycle={(cycle) => {
          setSelectedCycle(cycle);
          setIsSelectorOpen(false);
          // Update cycle start date based on selected cycle
          setCycleStart(new Date(cycle.startDate));
        }}
        selectedCycle={selectedCycle}
      />
    </div>
  );
};

export default MenuCycles;