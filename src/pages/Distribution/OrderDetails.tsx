import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { OrderItem } from '../../components/distribution/order-details/types';
import { ItemStatusBadge } from '../../components/distribution/order-details/ItemStatusBadge';
import { ConsolidatedItemsView } from '../../components/distribution/order-details/ConsolidatedItemsView';
import { OrderStatsSummary } from '../../components/distribution/order-details/OrderStatsSummary';

const OrderDetails = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedSchools, setSelectedSchools] = useState<Record<string, Set<string>>>({});
  const [selectedSubstitutes, setSelectedSubstitutes] = useState<Record<string, Record<string, number>>>({});

  const items: OrderItem[] = [
    {
      id: '1',
      name: 'Whole Grain Bread',
      quantity: 450,
      available: 400,
      unit: 'loaves',
      storage: {
        category: 'Dry Goods',
        location: 'A1-23'
      },
      schools: [
        { name: 'Cybersoft High', quantity: 150 },
        { name: 'Cybersoft Middle', quantity: 200 },
        { name: 'Primero High', quantity: 100 }
      ],
      substitutes: [
        { id: 'sub1', name: 'Whole Grain Rolls', available: 200, unit: 'pieces', conversionFactor: 2 },
        { id: 'sub2', name: 'Whole Wheat Bread', available: 150, unit: 'loaves', conversionFactor: 1 }
      ]
    },
    {
      id: '2',
      name: 'Fresh Apples',
      quantity: 800,
      available: 600,
      unit: 'cases',
      storage: {
        category: 'Produce',
        location: 'P2-15'
      },
      schools: [
        { name: 'Cybersoft High', quantity: 250 },
        { name: 'Cybersoft Middle', quantity: 200 },
        { name: 'Cybersoft Elementary', quantity: 150 },
        { name: 'Primero High', quantity: 200 }
      ],
      substitutes: [
        { id: 'sub3', name: 'Fresh Pears', available: 300, unit: 'cases', conversionFactor: 1 },
        { id: 'sub4', name: 'Fresh Oranges', available: 250, unit: 'cases', conversionFactor: 1 }
      ]
    },
    {
      id: '3',
      name: 'Milk Cartons',
      quantity: 2000,
      available: 1800,
      unit: 'units',
      storage: {
        category: 'Refrigerated',
        location: 'R3-45'
      },
      schools: [
        { name: 'Cybersoft High', quantity: 600 },
        { name: 'Cybersoft Middle', quantity: 500 },
        { name: 'Cybersoft Elementary', quantity: 400 },
        { name: 'Primero High', quantity: 500 }
      ],
      substitutes: []
    },
    {
      id: '4',
      name: 'Chicken Patties',
      quantity: 1200,
      available: 1000,
      unit: 'cases',
      storage: {
        category: 'Frozen',
        location: 'F1-12'
      },
      schools: [
        { name: 'Cybersoft High', quantity: 400 },
        { name: 'Cybersoft Middle', quantity: 300 },
        { name: 'Cybersoft Elementary', quantity: 250 },
        { name: 'Primero High', quantity: 250 }
      ],
      substitutes: [
        { id: 'sub5', name: 'Turkey Patties', available: 300, unit: 'cases', conversionFactor: 1 }
      ]
    }
  ];

  const canFulfillSchoolOrder = (
    item: OrderItem,
    school: { name: string; quantity: number },
    previouslySelectedQuantity: number
  ) => {
    const availableForSchool = Math.max(0, item.available - previouslySelectedQuantity);
    return availableForSchool >= school.quantity;
  };

  const handleItemExpand = (itemId: string, expanded: boolean) => {
    if (expanded && !selectedSchools[itemId]) {
      // Auto-select schools that can be fully fulfilled
      const item = items.find(i => i.id === itemId);
      if (item) {
        let runningTotal = 0;
        const autoSelectedSchools = new Set<string>();
        
        // Try to fulfill schools in order
        item.schools.forEach(school => {
          if (canFulfillSchoolOrder(item, school, runningTotal)) {
            autoSelectedSchools.add(school.name);
            runningTotal += school.quantity;
          }
        });

        if (autoSelectedSchools.size > 0) {
          setSelectedSchools(prev => ({
            ...prev,
            [itemId]: autoSelectedSchools
          }));
        }
      }
    }
    
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: expanded
    }));
  };

  const handleSchoolSelect = (itemId: string, schoolName: string) => {
    setSelectedSchools(prev => {
      const newSchools = { ...prev };
      if (!newSchools[itemId]) {
        newSchools[itemId] = new Set();
      }
      if (newSchools[itemId].has(schoolName)) {
        newSchools[itemId].delete(schoolName);
      } else {
        newSchools[itemId].add(schoolName);
      }
      return newSchools;
    });
  };

  const handleSubstituteChange = (itemId: string, substituteId: string, quantity: number) => {
    setSelectedSubstitutes(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [substituteId]: quantity
      }
    }));
  };

  const isSchoolOrderFulfilled = (
    item: OrderItem,
    school: { name: string; quantity: number },
    selectedSchoolsList: { name: string; quantity: number }[],
    substitutes: Record<string, number>
  ) => {
    if (!selectedSchools[item.id]?.has(school.name)) return false;

    const schoolIndex = selectedSchoolsList.findIndex(s => s.name === school.name);
    const previousSelectedQuantity = selectedSchoolsList
      .slice(0, schoolIndex)
      .reduce((sum, s) => sum + s.quantity, 0);
    
    const availableOriginal = Math.max(0, Math.min(
      school.quantity,
      item.available - previousSelectedQuantity
    ));

    const substituteTotal = Object.entries(substitutes).reduce((sum, [_, quantity]) => {
      const substitute = item.substitutes?.find(s => s.id === _);
      return sum + (quantity * (substitute?.conversionFactor || 1));
    }, 0);

    return availableOriginal + substituteTotal >= school.quantity;
  };

  const getRemainingShortage = (item: OrderItem) => {
    const selectedSchoolsList = item.schools.filter(s => selectedSchools[item.id]?.has(s.name));
    const totalSelected = selectedSchoolsList.reduce((sum, school) => sum + school.quantity, 0);
    const availableOriginal = Math.min(item.available, totalSelected);
    
    const substituteTotal = Object.entries(selectedSubstitutes[item.id] || {}).reduce((sum, [id, quantity]) => {
      const substitute = item.substitutes?.find(s => s.id === id);
      return sum + (quantity * (substitute?.conversionFactor || 1));
    }, 0);

    return Math.max(0, totalSelected - availableOriginal - substituteTotal);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/distribution')}
          className={`flex items-center space-x-2 ${
            darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Calendar</span>
        </button>
      </div>

      {/* Stats Summary */}
      <OrderStatsSummary items={items} date={date!} />

      {/* Items Table */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className="w-8"></th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Item
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Ordered
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Available
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Shortage
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Status
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Storage
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <tr className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="pl-4">
                    <button
                      onClick={() => handleItemExpand(item.id, !expandedItems[item.id])}
                      className={`p-1 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {expandedItems[item.id] ? (
                        <ChevronDown className={`w-5 h-5 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      ) : (
                        <ChevronRight className={`w-5 h-5 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.quantity} {item.unit}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.available} {item.unit}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    item.quantity > item.available
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.quantity > item.available ? `${item.quantity - item.available} ${item.unit}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <ItemStatusBadge 
                      item={item}
                      selectedSubstitutes={selectedSubstitutes}
                      selectedSchools={selectedSchools}
                      isSchoolOrderFulfilled={isSchoolOrderFulfilled}
                    />
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.storage.location}
                  </td>
                </tr>
                {expandedItems[item.id] && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4">
                      <ConsolidatedItemsView
                        item={item}
                        selectedSchools={selectedSchools}
                        selectedSubstitutes={selectedSubstitutes}
                        onSchoolSelect={handleSchoolSelect}
                        onSubstituteChange={handleSubstituteChange}
                        isSchoolOrderFulfilled={isSchoolOrderFulfilled}
                        getRemainingShortage={getRemainingShortage}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;