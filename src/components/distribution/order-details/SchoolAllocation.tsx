import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { OrderItem } from './types';

interface SchoolAllocationProps {
  item: OrderItem;
  school: { name: string; quantity: number };
  isSelected: boolean;
  selectedSchoolsList: { name: string; quantity: number }[];
  substitutes: Record<string, number>;
  onSchoolSelect: (schoolName: string) => void;
  isSchoolOrderFulfilled: (
    item: OrderItem,
    school: { name: string; quantity: number },
    selectedSchoolsList: { name: string; quantity: number }[],
    substitutes: Record<string, number>
  ) => boolean;
  onShowSubstitutes?: () => void;
}

export const SchoolAllocation: React.FC<SchoolAllocationProps> = ({
  item,
  school,
  isSelected,
  selectedSchoolsList,
  substitutes,
  onSchoolSelect,
  isSchoolOrderFulfilled,
  onShowSubstitutes
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const isFulfilled = isSchoolOrderFulfilled(item, school, selectedSchoolsList, substitutes);
  const [showSubPrompt, setShowSubPrompt] = useState(false);

  const getAllocationMessage = () => {
    if (!isSelected) return null;

    const schoolIndex = selectedSchoolsList.findIndex(s => s.name === school.name);
    const previousSelectedQuantity = selectedSchoolsList
      .slice(0, schoolIndex)
      .reduce((sum, s) => sum + s.quantity, 0);
    
    const availableOriginal = Math.max(0, Math.min(
      school.quantity,
      item.available - previousSelectedQuantity
    ));

    // Only show substitution details if this school needs them
    const needsSubstitutes = availableOriginal < school.quantity;
    if (!needsSubstitutes) {
      return (
        <span>{availableOriginal} {item.unit} original</span>
      );
    }

    const substitutionDetails = item.substitutes
      ?.map(sub => {
        const quantity = substitutes[sub.id] || 0;
        if (quantity === 0) return null;
        return `${quantity} ${sub.unit} ${sub.name}`;
      })
      .filter(Boolean);

    if (substitutionDetails?.length) {
      return (
        <div className="flex items-center space-x-2">
          <span>{availableOriginal} {item.unit} original</span>
          <span>+</span>
          <span>{substitutionDetails.join(', ')}</span>
        </div>
      );
    }

    return (
      <span>{availableOriginal} {item.unit} original</span>
    );
  };

  const handleSchoolSelect = () => {
    onSchoolSelect(school.name);
    
    // If selecting and we can't fulfill with original stock, show substitution prompt
    if (!isSelected) {
      const schoolIndex = selectedSchoolsList.length;
      const previousSelectedQuantity = selectedSchoolsList
        .reduce((sum, s) => sum + s.quantity, 0);
      
      const availableOriginal = Math.max(0, Math.min(
        school.quantity,
        item.available - previousSelectedQuantity
      ));

      if (availableOriginal < school.quantity && item.substitutes?.length) {
        setShowSubPrompt(true);
      }
    } else {
      setShowSubPrompt(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSchoolSelect}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {school.name}
          </span>
        </label>
        <div className="flex items-center space-x-4">
          {isSelected && (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getAllocationMessage()}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {school.quantity.toLocaleString()} {item.unit}
            </span>
            {isSelected && (
              isFulfilled ? (
                <CheckCircle2 className={`w-5 h-5 ${
                  darkMode ? 'text-green-400' : 'text-green-500'
                }`} />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${
                  darkMode ? 'text-red-400' : 'text-red-500'
                }`} />
              )
            )}
          </div>
        </div>
      </div>

      {/* Substitution prompt */}
      {showSubPrompt && (
        <div className={`ml-8 p-3 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Would you like to view recommended substitutions to fulfill the remaining quantity?
            </p>
            <button
              onClick={() => {
                setShowSubPrompt(false);
                onShowSubstitutes?.();
              }}
              className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg"
            >
              <span>View Substitutes</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};