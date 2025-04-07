import React from 'react';
import { useStore } from '../../../store/useStore';
import { ChevronDown } from 'lucide-react';
import { OrderItem, SubstituteItem } from './types';

interface SubstitutionSectionProps {
  item: OrderItem;
  substitutes: Record<string, number>;
  onSubstituteChange: (substituteId: string, quantity: number) => void;
  getRemainingShortage: (item: OrderItem) => number;
}

export const SubstitutionSection: React.FC<SubstitutionSectionProps> = ({
  item,
  substitutes,
  onSubstituteChange,
  getRemainingShortage
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const getQuickFillOptions = (substitute: SubstituteItem): { label: string; value: number }[] => {
    const shortage = getRemainingShortage(item);
    const maxSubstitute = Math.min(
      substitute.available,
      Math.ceil(shortage / substitute.conversionFactor)
    );

    return [
      { label: 'Fill Shortage', value: Math.ceil(shortage / substitute.conversionFactor) },
      { label: 'Fill Half', value: Math.ceil(shortage / substitute.conversionFactor / 2) },
      { label: 'Fill Available', value: maxSubstitute }
    ].filter(option => option.value <= maxSubstitute && option.value > 0);
  };

  if (!item.substitutes?.length) return null;

  // Only show substitution section if there's a shortage
  const shortage = getRemainingShortage(item);
  if (shortage <= 0) return null;

  return (
    <div className="mt-4 space-y-4">
      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Substitution Recommendations
      </div>
      <div className="space-y-3">
        {item.substitutes.map(substitute => {
          const currentQuantity = substitutes[substitute.id] || 0;
          const maxQuantity = Math.min(
            substitute.available,
            Math.ceil(shortage / substitute.conversionFactor)
          );

          return (
            <div key={substitute.id} className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {substitute.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Available: {substitute.available} {substitute.unit}
                  {substitute.conversionFactor !== 1 && (
                    <span> ({substitute.conversionFactor} {substitute.unit} = 1 {item.unit})</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={currentQuantity}
                    onChange={(e) => onSubstituteChange(
                      substitute.id,
                      Math.min(maxQuantity, Math.max(0, parseInt(e.target.value) || 0))
                    )}
                    className={`w-20 px-2 py-1 text-sm rounded-md ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  >
                    {Array.from({ length: maxQuantity + 1 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  <div className="absolute right-0 top-0 h-full flex items-center pr-2 pointer-events-none">
                    <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {substitute.unit}
                </span>
                <div className="relative group">
                  <button
                    type="button"
                    className={`px-2 py-1 text-xs rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Quick Fill
                    <ChevronDown className="w-3 h-3 ml-1 inline-block" />
                  </button>
                  <div className={`absolute right-0 mt-1 w-32 rounded-lg shadow-lg overflow-hidden z-10 hidden group-hover:block ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    {getQuickFillOptions(substitute).map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => onSubstituteChange(substitute.id, option.value)}
                        className={`w-full text-left px-3 py-1.5 text-sm ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Remaining shortage: {shortage} {item.unit}
      </div>
    </div>
  );
};