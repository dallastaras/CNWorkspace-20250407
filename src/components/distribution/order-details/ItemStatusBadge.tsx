import React from 'react';
import { useStore } from '../../../store/useStore';
import { OrderItem } from './types';

interface ItemStatusBadgeProps {
  item: OrderItem;
  selectedSubstitutes: Record<string, Record<string, number>>;
  selectedSchools: Record<string, Set<string>>;
  isSchoolOrderFulfilled: (
    item: OrderItem,
    school: { name: string; quantity: number },
    selectedSchoolsList: { name: string; quantity: number }[],
    substitutes: Record<string, number>
  ) => boolean;
}

export const ItemStatusBadge: React.FC<ItemStatusBadgeProps> = ({
  item,
  selectedSubstitutes,
  selectedSchools,
  isSchoolOrderFulfilled
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const getItemStatus = () => {
    const hasSubstitutes = Object.values(selectedSubstitutes[item.id] || {}).some(qty => qty > 0);
    const allSchoolsFulfilled = item.schools.every(school => 
      isSchoolOrderFulfilled(
        item,
        school,
        item.schools.filter(s => selectedSchools[item.id]?.has(s.name)),
        selectedSubstitutes[item.id] || {}
      )
    );

    if (item.available >= item.quantity) {
      return {
        label: 'Sufficient Stock',
        className: darkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-100 text-green-800'
      };
    } else if (hasSubstitutes && allSchoolsFulfilled) {
      return {
        label: 'Sufficient Stock (with Substitutions)',
        className: darkMode ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        label: 'Insufficient Stock',
        className: darkMode ? 'bg-red-400/10 text-red-400' : 'bg-red-100 text-red-800'
      };
    }
  };

  const status = getItemStatus();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
      {status.label}
    </span>
  );
};