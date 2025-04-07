import React from 'react';
import { useStore } from '../../../store/useStore';
import { SchoolMetrics } from '../../../types';

interface RevenueDetailsProps {
  metrics: SchoolMetrics[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const RevenueDetails: React.FC<RevenueDetailsProps> = ({
  metrics,
  dateRange
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const calculateRevenue = () => {
    if (!metrics?.length) return {
      reimbursableRevenue: 0,
      aLaCarteRevenue: 0,
      totalRevenue: 0,
      expectedRevenue: 0
    };

    const reimbursableRevenue = metrics.reduce((sum, metric) => {
      // Breakfast revenue
      const breakfastRevenue = 
        (metric.free_meal_breakfast || 0) * 2.50 +    // Free breakfast
        (metric.reduced_meal_breakfast || 0) * 2.30 + // Reduced breakfast
        (metric.paid_meal_breakfast || 0) * 0.75 +    // Paid breakfast
        ((metric.breakfast_count || 0) * 0.05 * 3.50); // Adult breakfast (5% at $3.50)

      // Lunch revenue
      const lunchRevenue = 
        (metric.free_meal_lunch || 0) * 3.75 +    // Free lunch
        (metric.reduced_meal_lunch || 0) * 3.35 + // Reduced lunch
        (metric.paid_meal_lunch || 0) * 0.50 +    // Paid lunch
        ((metric.lunch_count || 0) * 0.08 * 4.50); // Adult lunch (8% at $4.50)

      // Snack revenue
      const snackRevenue = 
        (metric.free_meal_snack || 0) * 1.00 +    // Free snack
        (metric.reduced_meal_snack || 0) * 0.50 + // Reduced snack
        (metric.paid_meal_snack || 0) * 0.25 +    // Paid snack
        ((metric.snack_count || 0) * 0.02 * 2.00); // Adult snack (2% at $2.00)

      // Supper revenue
      const supperRevenue = 
        (metric.free_meal_supper || 0) * 3.75 +    // Free Supper
        (metric.reduced_meal_supper || 0) * 3.35 + // Reduced Supper
        (metric.paid_meal_supper || 0) * 0.50 +    // Paid Supper
        ((metric.lunch_supper || 0) * 0.08 * 4.50); // Adult Supper (8% at $4.50)

      return sum + breakfastRevenue + lunchRevenue + snackRevenue + supperRevenue;
    }, 0);

    const aLaCarteRevenue = metrics.reduce((sum, metric) => {
      // Breakfast a la carte
      const breakfastALaCarte = 
        ((metric.breakfast_count || 0) * 0.10 * 2.00) + // 10% students at $2.00
        ((metric.breakfast_count || 0) * 0.02 * 2.50);  // 2% adults at $2.50

      // Lunch a la carte
      const lunchALaCarte = 
        ((metric.lunch_count || 0) * 0.15 * 2.50) +    // 15% students at $2.50
        ((metric.lunch_count || 0) * 0.03 * 3.00);     // 3% adults at $3.00

      // Snack a la carte
      const snackALaCarte = 
        ((metric.snack_count || 0) * 0.20 * 1.50) +    // 20% students at $1.50
        ((metric.snack_count || 0) * 0.01 * 2.00);     // 1% adults at $2.00

      // Supper a la carte
      const supperALaCarte = 
        ((metric.supper_count || 0) * 0.15 * 2.50) +    // 15% students at $2.50
        ((metric.supper_count || 0) * 0.03 * 3.00);     // 3% adults at $3.00

      return sum + breakfastALaCarte + lunchALaCarte + snackALaCarte + supperALaCarte;
    }, 0);

    // Calculate expected revenue based on meal counts and standard rates
    const expectedRevenue = metrics.reduce((sum, metric) => {
      const expectedBreakfastRevenue = (metric.breakfast_count || 0) * 2.00; // Average expected breakfast revenue
      const expectedLunchRevenue = (metric.lunch_count || 0) * 3.00; // Average expected lunch revenue
      const expectedSnackRevenue = (metric.snack_count || 0) * 0.75; // Average expected snack revenue
      const expectedSupperRevenue = (metric.supper_count || 0) * 3.00; // Average expected supper revenue
      return sum + expectedBreakfastRevenue + expectedLunchRevenue + expectedSnackRevenue + expectedSupperRevenue;
    }, 0);

    return {
      reimbursableRevenue,
      aLaCarteRevenue,
      totalRevenue: reimbursableRevenue + aLaCarteRevenue,
      expectedRevenue
    };
  };

  const { reimbursableRevenue, aLaCarteRevenue, totalRevenue, expectedRevenue } = calculateRevenue();
  const difference = totalRevenue - expectedRevenue;
  const percentageDifference = expectedRevenue > 0 ? (difference / expectedRevenue) * 100 : 0;
  const isAboveExpected = difference > 0;

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Revenue Overview
      </h3>
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Actual Revenue
            </div>
            <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Expected Revenue
            </div>
            <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ${expectedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Difference
          </div>
          <div className={`text-lg font-medium ${
            isAboveExpected 
              ? darkMode ? 'text-green-400' : 'text-green-600'
              : darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {isAboveExpected ? '+' : ''}{difference.toLocaleString('en-US', { 
              style: 'currency', 
              currency: 'USD' 
            })} ({isAboveExpected ? '+' : ''}{percentageDifference.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Meals */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Meals
        </h3>
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Category
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student (Free)</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + (m.free_meal_lunch || 0), 0) * 3.75).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student (Reduced)</td>

                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + (m.reduced_meal_lunch || 0), 0) * 3.35).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student (Paid)</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + (m.paid_meal_lunch || 0), 0) * 0.50).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student (Second Meal)</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.lunch_count || 0) * 0.02), 0) * 4.00).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Adult</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.lunch_count || 0) * 0.08), 0) * 4.50).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className={`font-medium ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Total Meals</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${reimbursableRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* A La Carte Sales */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          A la Carte (ALC)
        </h3>
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className={`px-4 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Category
                </th>
                <th className={`px-4 py-2 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student Breakfast Items</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.breakfast_count || 0) * 0.10 * 2.00), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student Lunch Items</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.lunch_count || 0) * 0.15 * 2.50), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student Snack Items</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.snack_count || 0) * 0.20 * 1.50), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Student Supper Items</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(metrics.reduce((sum, m) => sum + ((m.supper_count || 0) * 0.15 * 2.50), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Adult Items</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${(
                    metrics.reduce((sum, m) => sum + 
                      ((m.breakfast_count || 0) * 0.02 * 2.50) +  // Adult breakfast
                      ((m.lunch_count || 0) * 0.03 * 3.00) +      // Adult lunch
                      ((m.snack_count || 0) * 0.01 * 2.00) +      // Adult snack
                      ((m.supper_count || 0) * 0.03 * 3.00),       // Adult supper
                    0)
                  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className={`font-medium ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Total A La Carte</td>
                <td className={`px-4 py-2 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${aLaCarteRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};