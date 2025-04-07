import React from 'react';
import { useStore } from '../../../store/useStore';
import { Utensils } from 'lucide-react';

interface MealTypeDetailsProps {
  metrics: {
    free_meal_breakfast?: number;
    reduced_meal_breakfast?: number;
    paid_meal_breakfast?: number;
    breakfast_count?: number;
    free_meal_lunch?: number;
    reduced_meal_lunch?: number;
    paid_meal_lunch?: number;
    lunch_count?: number;
    free_meal_snack?: number;
    reduced_meal_snack?: number;
    paid_meal_snack?: number;
    snack_count?: number;
    free_meal_supper?: number;
    reduced_meal_supper?: number;
    paid_meal_supper?: number;
    supper_count?: number;
  }[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const MealTypeDetails: React.FC<MealTypeDetailsProps> = ({
  metrics,
  dateRange
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Calculate totals for each meal type and eligibility
  const totals = metrics.reduce((acc, metric) => ({
    breakfast: {
      free: (acc.breakfast.free || 0) + (metric.free_meal_breakfast || 0),
      reduced: (acc.breakfast.reduced || 0) + (metric.reduced_meal_breakfast || 0),
      paid: (acc.breakfast.paid || 0) + (metric.paid_meal_breakfast || 0),
      total: (acc.breakfast.total || 0) + (metric.breakfast_count || 0)
    },
    lunch: {
      free: (acc.lunch.free || 0) + (metric.free_meal_lunch || 0),
      reduced: (acc.lunch.reduced || 0) + (metric.reduced_meal_lunch || 0),
      paid: (acc.lunch.paid || 0) + (metric.paid_meal_lunch || 0),
      total: (acc.lunch.total || 0) + (metric.lunch_count || 0)
    },
    snack: {
      free: (acc.snack.free || 0) + (metric.free_meal_snack || 0),
      reduced: (acc.snack.reduced || 0) + (metric.reduced_meal_snack || 0),
      paid: (acc.snack.paid || 0) + (metric.paid_meal_snack || 0),
      total: (acc.snack.total || 0) + (metric.snack_count || 0)
    },
    supper: {
      free: (acc.supper.free || 0) + (metric.free_meal_supper || 0),
      reduced: (acc.supper.reduced || 0) + (metric.reduced_meal_supper || 0),
      paid: (acc.supper.paid || 0) + (metric.paid_meal_supper || 0),
      total: (acc.supper.total || 0) + (metric.supper_count || 0)
    }
  }), {
    breakfast: { free: 0, reduced: 0, paid: 0, total: 0 },
    lunch: { free: 0, reduced: 0, paid: 0, total: 0 },
    snack: { free: 0, reduced: 0, paid: 0, total: 0 },
    supper: { free: 0, reduced: 0, paid: 0, total: 0 }
  });

  // Calculate grand totals
  const grandTotal = {
    free: totals.breakfast.free + totals.lunch.free + totals.snack.free + totals.supper.free,
    reduced: totals.breakfast.reduced + totals.lunch.reduced + totals.snack.reduced + totals.supper.reduced,
    paid: totals.breakfast.paid + totals.lunch.paid + totals.snack.paid + totals.supper.paid,
    total: totals.breakfast.total + totals.lunch.total + totals.snack.total + totals.supper.total
  };

  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Meal Service Overview
      </h3>
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
        <table className="min-w-full">
          <thead>
            <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <th className={`px-4 py-2 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Meal Type
              </th>
              <th className={`px-4 py-2 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Free
              </th>
              <th className={`px-4 py-2 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Reduced
              </th>
              <th className={`px-4 py-2 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Paid
              </th>
              <th className={`px-4 py-2 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Total
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {[
              { type: 'Breakfast', data: totals.breakfast },
              { type: 'Lunch', data: totals.lunch },
              { type: 'Snack', data: totals.snack },
              { type: 'Supper', data: totals.supper }
            ].map(({ type, data }) => (
              <tr key={type}>
                <td className={`px-4 py-3 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {type}
                </td>
                <td className={`px-4 py-3 text-right text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <div>{data.free.toLocaleString()}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {calculatePercentage(data.free, data.total)}%
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <div>{data.reduced.toLocaleString()}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {calculatePercentage(data.reduced, data.total)}%
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <div>{data.paid.toLocaleString()}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {calculatePercentage(data.paid, data.total)}%
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {data.total.toLocaleString()}
                </td>
              </tr>
            ))}
            {/* Grand Total Row */}
            <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <td className={`px-4 py-3 text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Total
              </td>
              <td className={`px-4 py-3 text-right text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                <div>{grandTotal.free.toLocaleString()}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {calculatePercentage(grandTotal.free, grandTotal.total)}%
                </div>
              </td>
              <td className={`px-4 py-3 text-right text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                <div>{grandTotal.reduced.toLocaleString()}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {calculatePercentage(grandTotal.reduced, grandTotal.total)}%
                </div>
              </td>
              <td className={`px-4 py-3 text-right text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                <div>{grandTotal.paid.toLocaleString()}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {calculatePercentage(grandTotal.paid, grandTotal.total)}%
                </div>
              </td>
              <td className={`px-4 py-3 text-right text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {grandTotal.total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};