import React from 'react';
import { useStore } from '../../store/useStore';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Bot,
  Award, 
  Utensils, 
  DollarSign, 
  Users,
  CheckCircle2,
  AlertTriangle,
  SearchCheck
} from 'lucide-react';

interface MenuCycleAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  cycleData: {
    program: string;
    length: string;
    audience: string;
    planned_meals?: number;
    composition: {
      grade: string;
      popularity: number;
      variety: number;
    };
    cost: {
      grade: string;
      food: string;
      labor: string;
    };
    participation: {
      grade: string;
      expected: number;
      average: number;
      difference: number;
    };
    score: {
      grade: string;
    };
  };
}

export const MenuCycleAnalysis: React.FC<MenuCycleAnalysisProps> = ({
  isOpen,
  onClose,
  cycleData
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const displaySettings = useStore((state) => state.displaySettings);

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getScoreBackground = (grade: string) => {
    switch (grade[0]) {
      case 'A':
        return darkMode ? 'bg-green-400/5' : 'bg-green-50';
      case 'B':
        return darkMode ? 'bg-blue-400/5' : 'bg-blue-50';
      case 'C':
        return darkMode ? 'bg-amber-400/5' : 'bg-amber-50';
      case 'D':
        return darkMode ? 'bg-amber-400/5' : 'bg-amber-50';
      default:
        return darkMode ? 'bg-red-400/5' : 'bg-red-50';
    }
  };

  // Calculate food cost impact
  const calculateFoodCostImpact = () => {
    const averageMealCost = 2.50; // Average cost per meal
    const projectedMeals = Math.round(cycleData.participation.expected * 1000); // Assuming 1000 enrolled students
    const actualMeals = Math.round(cycleData.participation.average * 1000);
    
    return (projectedMeals - actualMeals) * averageMealCost;
  };

  // Calculate expected meals
  const calculateExpectedMeals = () => {
    const baseEnrollment = 1000; // Example base enrollment
    const daysInCycle = 20; // 4 weeks * 5 days
    
    const dailyMeals = Math.round(baseEnrollment * (cycleData.participation.expected / 100));
    return dailyMeals * daysInCycle;
  };

  const getGradeColor = (grade: string) => {
    switch (grade[0]) {
      case 'A':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'B':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'C':
        return darkMode ? 'text-amber-400' : 'text-amber-600';
      case 'D':
        return darkMode ? 'text-amber-400' : 'text-amber-600';
      default:
        return darkMode ? 'text-red-400' : 'text-red-600';
    }
  };

  const renderSection = (
    title: string,
    grade: string,
    items: Array<{ label: string; value: string | number }>, 
    Icon?: React.ElementType
  ) => (
    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <Icon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
          )}
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          getScoreBackground(grade)
        }`}>
          <span className={`text-lg font-bold ${getGradeColor(grade)}`}>
            {grade}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.label}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {typeof item.value === 'number' && item.label.toLowerCase().includes('difference') ? (
                <span className={`flex items-center ${
                  item.value >= 0 
                    ? darkMode ? 'text-green-400' : 'text-green-600'
                    : darkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  {item.value >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {item.value > 0 ? '+' : ''}{item.value}%
                </span>
              ) : (
                <span className="font-medium">
                  {typeof item.value === 'number' ? `${item.value}%` : item.value}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Menu Cycle Analysis"
      icon={<Award className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Detailed performance metrics"
      width="lg"
    >
      <div className="px-4 py-6 sm:px-6 space-y-8">
        {/* Schoolie's Summary 
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            This {cycleData.length.toLowerCase()} menu cycle for {cycleData.program} is performing at a {cycleData.score.grade} level. 
            {cycleData.participation.difference > 0 
              ? ` We're seeing strong student engagement with participation ${cycleData.participation.difference}% above average.`
              : ` There's room for improvement in student engagement with participation ${Math.abs(cycleData.participation.difference)}% below average.`
            }
          </p>
        </div>
        */}

        {/* Strengths 
        <div className="space-y-2">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Strengths
          </h3>
          <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {cycleData.cost.food === 'Low' && (
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Cost-effective menu planning
              </li>
            )}
            {cycleData.participation.difference > 0 && (
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Above-average participation
              </li>
            )}
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              {cycleData.planned_meals?.toLocaleString()} meals planned
            </li>
          </ul>
        </div>
        */}

        {/* Opportunities 
        <div className="space-y-2">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Opportunities
          </h3>
          <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {cycleData.cost.food === 'High' && (
              <li className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                Review food costs
              </li>
            )}
            {cycleData.participation.difference < 0 && (
              <li className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                Boost student engagement
              </li>
            )}
            {cycleData.cost.labor === 'High' && (
              <li className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                Optimize labor utilization
              </li>
            )}
          </ul>
        </div>
        */}

        {/* Recommendations 
        <div className="space-y-2">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Recommendations
          </h3>
          <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {cycleData.cost.food === 'High' && (
              <li>Consider ingredient substitutions to reduce food costs while maintaining quality</li>
            )}
            {cycleData.participation.difference < 0 && (
              <li>Survey students to understand preferences and adjust menu items accordingly</li>
            )}
            {cycleData.cost.labor === 'High' && (
              <li>Review production schedules to identify efficiency opportunities</li>
            )}
            <li>Continue monitoring student feedback to maintain high satisfaction levels</li>
          </ul>
        </div>
        */}

        {/* Cycle Info */}
        {renderSection('Cycle Information', cycleData.score.grade, [
          { label: 'Program', value: cycleData.program },
          { label: 'Length', value: cycleData.length },
          { label: 'Audience', value: cycleData.audience }
        ], Utensils)}

        {/* Cost */}
        {renderSection('Cost Analysis', cycleData.cost.grade, [
          { label: 'Planned Meals', value: cycleData.planned_meals?.toLocaleString() || '0' },
          { label: 'Cost', value: `$${Math.abs(calculateFoodCostImpact()).toLocaleString()}` },
          { label: 'Food', value: cycleData.cost.food },
          { label: 'Labor', value: cycleData.cost.labor }
        ], DollarSign)}

        {/* Participation */}
        {renderSection('Student Participation', cycleData.participation.grade, [
          { label: 'Expected Meals', value: calculateExpectedMeals().toLocaleString() },
          { label: 'Expected Rate', value: cycleData.participation.expected },
          { label: 'Average Rate', value: cycleData.participation.average },
          { label: 'Difference', value: cycleData.participation.difference }
        ], Users)}

        {/* Cost Impact Summary */}
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center space-x-3">
            <DollarSign className={`w-5 h-5 ${
              calculateFoodCostImpact() > 0
                ? darkMode ? 'text-green-400' : 'text-green-600'
                : darkMode ? 'text-red-400' : 'text-red-600'
            }`} />
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {calculateFoodCostImpact() > 0
                ? `This menu cycle is projected to generate an additional $${calculateFoodCostImpact().toLocaleString()} in revenue through increased participation.`
                : `This menu cycle may result in $${Math.abs(calculateFoodCostImpact()).toLocaleString()} less revenue due to lower projected participation.`
              }
            </p>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};