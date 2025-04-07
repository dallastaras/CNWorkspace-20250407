import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { OrderItem } from './types';
import { ItemStatusBadge } from './ItemStatusBadge';
import { SchoolAllocation } from './SchoolAllocation';
import { SubstitutionSection } from './SubstitutionSection';

interface ConsolidatedItemsViewProps {
  item: OrderItem;
  selectedSchools: Record<string, Set<string>>;
  selectedSubstitutes: Record<string, Record<string, number>>;
  onSchoolSelect: (itemId: string, schoolName: string) => void;
  onSubstituteChange: (itemId: string, substituteId: string, quantity: number) => void;
  isSchoolOrderFulfilled: (
    item: OrderItem,
    school: { name: string; quantity: number },
    selectedSchoolsList: { name: string; quantity: number }[],
    substitutes: Record<string, number>
  ) => boolean;
  getRemainingShortage: (item: OrderItem) => number;
}

export const ConsolidatedItemsView: React.FC<ConsolidatedItemsViewProps> = ({
  item,
  selectedSchools,
  selectedSubstitutes,
  onSchoolSelect,
  onSubstituteChange,
  isSchoolOrderFulfilled,
  getRemainingShortage
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  
  // Ensure we have a valid Set for the current item's selected schools
  const currentItemSelectedSchools = selectedSchools[item.id] || new Set<string>();
  
  // Get the list of selected schools for this item
  const selectedSchoolsList = item.schools.filter(s => currentItemSelectedSchools.has(s.name));

  return (
    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
      <div className="space-y-4">
        {item.schools.map((school) => (
          <SchoolAllocation
            key={school.name}
            item={item}
            school={school}
            isSelected={currentItemSelectedSchools.has(school.name)}
            selectedSchoolsList={selectedSchoolsList}
            substitutes={selectedSubstitutes[item.id] || {}}
            onSchoolSelect={(schoolName) => onSchoolSelect(item.id, schoolName)}
            isSchoolOrderFulfilled={isSchoolOrderFulfilled}
            onShowSubstitutes={() => setShowSubstitutes(true)}
          />
        ))}
        {showSubstitutes && item.quantity > item.available && (
          <SubstitutionSection
            item={item}
            substitutes={selectedSubstitutes[item.id] || {}}
            onSubstituteChange={(substituteId, quantity) => 
              onSubstituteChange(item.id, substituteId, quantity)
            }
            getRemainingShortage={getRemainingShortage}
          />
        )}
      </div>
    </div>
  );
};