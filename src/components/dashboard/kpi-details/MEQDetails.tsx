import React from 'react';
import { useStore } from '../../../store/useStore';
import { DollarSign } from 'lucide-react';

interface MEQDetailsProps {
  metrics: {
    breakfast_count?: number;
    lunch_count?: number;
    snack_count?: number;
    supper_count?: number;
    alc_revenue?: number;
  }[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const MEQDetails: React.FC<MEQDetailsProps> = ({
  metrics,
  dateRange
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Calculate totals across all metrics
  const totals = metrics.reduce((acc, metric) => ({
    studentBreakfast: acc.studentBreakfast + (metric.breakfast_count || 0) * 0.95, // 95% student meals
    adultBreakfast: acc.adultBreakfast + (metric.breakfast_count || 0) * 0.05,    // 5% adult meals
    studentLunch: acc.studentLunch + (metric.lunch_count || 0) * 0.92,            // 92% student meals
    adultLunch: acc.adultLunch + (metric.lunch_count || 0) * 0.08,               // 8% adult meals
    snacks: acc.snacks + (metric.snack_count || 0),
    supper: acc.supper + (metric.supper_count || 0),
    alcRevenue: acc.alcRevenue + (metric.alc_revenue || 0)
  }), {
    studentBreakfast: 0,
    adultBreakfast: 0,
    studentLunch: 0,
    adultLunch: 0,
    snacks: 0,
    supper: 0,
    alcRevenue: 0
  });

  // Calculate MEQs
  const meqs = {
    studentBreakfast: Math.round(totals.studentBreakfast * 0.67),
    adultBreakfast: Math.round(totals.adultBreakfast * 0.67),
    studentLunch: Math.round(totals.studentLunch),
    adultLunch: Math.round(totals.adultLunch),
    snacks: Math.round(totals.snacks * 0.33),
    supper: Math.round(totals.supper),
    alcRevenue: Math.round(totals.alcRevenue / 3.75) // Using current free lunch reimbursement rate
  };

  const totalMEQ = Object.values(meqs).reduce((sum, val) => sum + val, 0);

  // Calculate revenue sources and revenue per MEQ
  const revenue = {
    studentMeals: metrics.reduce((sum, m) => sum + (
      ((m.breakfast_count || 0) * 0.95 * 2.50) + // Student breakfast
      ((m.lunch_count || 0) * 0.92 * 3.75) +     // Student lunch
      ((m.snack_count || 0) * 0.98 * 1.00) +     // Student snack
      ((m.supper_count || 0) * 0.92 * 3.75)      // Student supper
    ), 0),
    adultMeals: metrics.reduce((sum, m) => sum + (
      ((m.breakfast_count || 0) * 0.05 * 3.50) + // Adult breakfast
      ((m.lunch_count || 0) * 0.08 * 4.50) +     // Adult lunch
      ((m.snack_count || 0) * 0.02 * 2.00) +     // Adult snack
      ((m.supper_count || 0) * 0.08 * 4.50)      // Adult supper
    ), 0),
    nonprogram: metrics.reduce((sum, m) => sum + (m.alc_revenue || 0), 0),
    contract: metrics.reduce((sum, m) => sum + 640, 0), // Example contract revenue
    federal: metrics.reduce((sum, m) => sum + (
      ((m.free_meal_breakfast || 0) * 2.50) +
      ((m.free_meal_lunch || 0) * 3.75) +
      ((m.free_meal_snack || 0) * 1.00) +
      ((m.free_meal_supper || 0) * 3.75)
    ), 0),
    usda: metrics.reduce((sum, m) => sum + 7180, 0), // Example USDA foods value
    state: metrics.reduce((sum, m) => sum + 850, 0), // Example state reimbursement
    interest: metrics.reduce((sum, m) => sum + 140, 0), // Example interest earned
    misc: metrics.reduce((sum, m) => sum + 260, 0) // Example miscellaneous revenue
  };

  const totalRevenue = Object.values(revenue).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Meal Equivalents (MEQ)
      </h3>
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <th className={`px-4 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider w-1/2`}>
                  Meal Categories
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  x
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Conversion Factors
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  =
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  MEQ
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.studentBreakfast).toLocaleString()} student reimbursable breakfasts
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>0.67</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.studentBreakfast.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.adultBreakfast).toLocaleString()} adult non-reimbursable breakfasts
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>0.67</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.adultBreakfast.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.studentLunch).toLocaleString()} student reimbursable lunches
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>1.00</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.studentLunch.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.adultLunch).toLocaleString()} adult lunches
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>1.00</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.adultLunch.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.snacks).toLocaleString()} after-school snacks
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>0.33</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.snacks.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(totals.supper).toLocaleString()} suppers
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>x</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>1.00</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.supper.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${totals.alcRevenue.toLocaleString()} dollars in nonprogram food sales
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>÷</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>3.75*</td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {meqs.alcRevenue.toLocaleString()} MEQ
                </td>
              </tr>
              <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} font-medium`}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Total
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}></td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}></td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {totalMEQ.toLocaleString()} MEQ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          * Current free lunch reimbursement rate
        </div>
      </div>

      {/* Revenue per MEQ Breakdown */}
      {/*}
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Revenue Per Meal Equivalent
      </h3>
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <th className={`px-4 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Revenue Source
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Revenues
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  ÷
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Total MEQs
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  =
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Revenue per MEQ
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {[
                { name: 'Student Meal Sales', value: revenue.studentMeals },
                { name: 'Adult Meal Sales', value: revenue.adultMeals },
                { name: 'Nonprogram Food Sales', value: revenue.nonprogram },
                { name: 'Contract Food Sales', value: revenue.contract },
                { name: 'Federal Reimbursement', value: revenue.federal },
                { name: 'USDA Foods', value: revenue.usda },
                { name: 'State Reimbursement', value: revenue.state },
                { name: 'Interest', value: revenue.interest },
                { name: 'Miscellaneous', value: revenue.misc }
              ].map((source) => (
                <tr key={source.name} className={darkMode ? 'bg-gray-800/50' : 'bg-white'}>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {source.name}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${source.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>÷</td>
                  <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {totalMEQ.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>=</td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${(source.value / totalMEQ).toFixed(4)}
                  </td>
                </tr>
              ))}
              <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} font-medium`}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Total Revenue
                </td>
                <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>÷</td>
                <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {totalMEQ.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>=</td>
                <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${(totalRevenue / totalMEQ).toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      */}
    </div>
  );
};