import React from 'react';
import { useStore } from '../../store/useStore';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { Settings, Star, Heart, BarChart2, DollarSign, Utensils, CheckCircle2, AlertTriangle, Percent } from 'lucide-react';

interface MenuCycleSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showScore: boolean;
    showItems: boolean;
    showStrengths: boolean;
    showWarnings: boolean;
    showCompliance: boolean;
    showPerformance: boolean;
    showCost: boolean;
    useGradeScores: boolean;
  };
  onSettingChange: (setting: keyof typeof settings) => void;
}

export const MenuCycleSettings: React.FC<MenuCycleSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingChange
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const settingOptions = [
    {
      key: 'showScore' as const,
      label: 'Overall Score',
      description: 'Show the overall menu score',
      icon: Star
    },
    {
      key: 'showItems' as const,
      label: 'Menu Items',
      description: 'Show menu items and recipes',
      icon: Utensils
    },
    {
      key: 'showStrengths' as const,
      label: 'Menu Strengths',
      description: 'Show menu strengths and highlights',
      icon: CheckCircle2
    },
    {
      key: 'showWarnings' as const,
      label: 'Menu Warnings',
      description: 'Show menu warnings and alerts',
      icon: AlertTriangle
    },
    {
      key: 'showCompliance' as const,
      label: 'Compliance Score',
      description: 'Show nutritional compliance score',
      icon: Heart
    },
    {
      key: 'showPerformance' as const,
      label: 'Performance Score',
      description: 'Show menu performance metrics',
      icon: BarChart2
    },
    {
      key: 'showCost' as const,
      label: 'Cost Efficiency',
      description: 'Show cost efficiency score',
      icon: DollarSign
    },
    {
      key: 'useGradeScores' as const,
      label: 'Grade Scores',
      description: 'Show letter grades instead of percentages',
      icon: Percent
    }
  ];

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Display Settings"
      icon={<Settings className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Configure calendar view options"
    >
      <div className="px-4 py-6 sm:px-6">
        <div className="space-y-6">
          {settingOptions.map(({ key, label, description, icon: Icon }) => (
            <div
              key={key}
              className={`flex items-start space-x-4 p-4 rounded-lg ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <Icon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {label}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => onSettingChange(key)}
                      className="sr-only peer"
                    />
                    <div className={`
                      w-11 h-6 rounded-full peer 
                      ${darkMode 
                        ? 'bg-gray-600 peer-checked:bg-indigo-600' 
                        : 'bg-gray-200 peer-checked:bg-indigo-600'
                      }
                      peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-[2px] 
                      after:left-[2px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:transition-all
                    `} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideOutPanel>
  );
};