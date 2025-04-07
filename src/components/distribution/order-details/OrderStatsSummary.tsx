import React from 'react';
import { useStore } from '../../../store/useStore';
import { Bot } from 'lucide-react';
import { OrderItem } from './types';

interface OrderStatsSummaryProps {
  items: OrderItem[];
  date: string;
}

export const OrderStatsSummary: React.FC<OrderStatsSummaryProps> = ({ items, date }) => {
  const darkMode = useStore((state) => state.darkMode);

  // Calculate summary statistics
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAvailable = items.reduce((sum, item) => sum + item.available, 0);
  const totalShortage = items.reduce((sum, item) => {
    const shortage = item.quantity - item.available;
    return sum + (shortage > 0 ? shortage : 0);
  }, 0);
  const itemsWithShortage = items.filter(item => item.quantity > item.available).length;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
            <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <h2 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Summary
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Orders for {new Date(date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Items</span>
                <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalItems}
                </p>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Ordered</span>
                <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalQuantity.toLocaleString()}
                </p>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available</span>
                <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalAvailable.toLocaleString()}
                </p>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Shortage</span>
                <p className={`text-2xl font-semibold ${
                  totalShortage > 0
                    ? darkMode ? 'text-red-400' : 'text-red-600'
                    : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {totalShortage > 0 ? totalShortage.toLocaleString() : '0'}
                </p>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Items Short</span>
                <p className={`text-2xl font-semibold ${
                  itemsWithShortage > 0
                    ? darkMode ? 'text-red-400' : 'text-red-600'
                    : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {itemsWithShortage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};