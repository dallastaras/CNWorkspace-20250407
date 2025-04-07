import React from 'react';
import { useStore } from '../../../store/useStore';
import { Calendar } from 'lucide-react';

interface MealMetrics {
  eligibilityType: 'Free' | 'Reduced' | 'Paid' | 'Total';
  enrolled: number;
  ada: number;
  meals: number;
  adpCount: number;
  adpPercentage: number;
  participationPercentage: number;
}

interface LunchParticipationDetailsProps {
  totalMeals: number;
  freeMeals: number;
  reducedMeals: number;
  paidMeals: number;
  totalEnrollment: number;
  freeCount: number;
  reducedCount: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  operatingDays: number;
  attendanceFactor?: number; // School-specific attendance factor, default to 0.93
}

export const LunchParticipationDetails: React.FC<LunchParticipationDetailsProps> = ({
  totalMeals = 0,
  freeMeals = 0,
  reducedMeals = 0,
  paidMeals = 0,
  totalEnrollment = 0,
  freeCount = 0,
  reducedCount = 0,
  dateRange,
  operatingDays = 1, // Prevent division by zero
  attendanceFactor = 0.93
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Ensure we have valid numbers
  const validTotalMeals = Math.max(0, totalMeals || 0);
  const validFreeMeals = Math.max(0, freeMeals || 0);
  const validReducedMeals = Math.max(0, reducedMeals || 0);
  const validPaidMeals = Math.max(0, paidMeals || 0);
  const validOperatingDays = Math.max(1, operatingDays); // Prevent division by zero

  // Calculate enrollment numbers using school data
  const freeEnrollment = freeCount;
  const reducedEnrollment = reducedCount;
  const paidEnrollment = totalEnrollment - freeEnrollment - reducedEnrollment;

  // Calculate ADA (Average Daily Attendance)
  const freeADA = Math.round(freeEnrollment * attendanceFactor);
  const reducedADA = Math.round(reducedEnrollment * attendanceFactor);
  const paidADA = Math.round(paidEnrollment * attendanceFactor);
  const totalADA = freeADA + reducedADA + paidADA;

  // Calculate ADP (Average Daily Participation)
  const freeADP = Math.round(validFreeMeals / validOperatingDays);
  const reducedADP = Math.round(validReducedMeals / validOperatingDays);
  const paidADP = Math.round(validPaidMeals / validOperatingDays);
  const totalADP = Math.round(validTotalMeals / validOperatingDays);

  // Calculate ADP percentages
  const freeADPPercentage = freeADA > 0 ? (freeADP / freeADA) * 100 : 0;
  const reducedADPPercentage = reducedADA > 0 ? (reducedADP / reducedADA) * 100 : 0;
  const paidADPPercentage = paidADA > 0 ? (paidADP / paidADA) * 100 : 0;
  const totalADPPercentage = totalADA > 0 ? (totalADP / totalADA) * 100 : 0;

  // Calculate participation percentages
  const freeParticipationPercentage = validTotalMeals > 0 ? (validFreeMeals / validTotalMeals) * 100 : 0;
  const reducedParticipationPercentage = validTotalMeals > 0 ? (validReducedMeals / validTotalMeals) * 100 : 0;
  const paidParticipationPercentage = validTotalMeals > 0 ? (validPaidMeals / validTotalMeals) * 100 : 0;

  const mealMetrics: MealMetrics[] = [
    {
      eligibilityType: 'Free',
      enrolled: freeEnrollment,
      ada: freeADA,
      meals: validFreeMeals,
      adpCount: freeADP,
      adpPercentage: freeADPPercentage,
      participationPercentage: freeParticipationPercentage
    },
    {
      eligibilityType: 'Reduced',
      enrolled: reducedEnrollment,
      ada: reducedADA,
      meals: validReducedMeals,
      adpCount: reducedADP,
      adpPercentage: reducedADPPercentage,
      participationPercentage: reducedParticipationPercentage
    },
    {
      eligibilityType: 'Paid',
      enrolled: paidEnrollment,
      ada: paidADA,
      meals: validPaidMeals,
      adpCount: paidADP,
      adpPercentage: paidADPPercentage,
      participationPercentage: paidParticipationPercentage
    },
    {
      eligibilityType: 'Total',
      enrolled: totalEnrollment,
      ada: totalADA,
      meals: validTotalMeals,
      adpCount: totalADP,
      adpPercentage: totalADPPercentage,
      participationPercentage: 100 // Total participation is always 100%
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Participation Overview
      </h3>
      {/* Operating Days Info */}

      {/* Metrics Table */}
      <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Students
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Enrolled
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  ADA
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Meals
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  ADP
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  ADP %
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Participation %
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              {mealMetrics.map((metric) => (
                <tr 
                  key={metric.eligibilityType}
                  className={metric.eligibilityType === 'Total' ? (
                    darkMode ? 'bg-gray-800 font-medium' : 'bg-gray-100 font-medium'
                  ) : ''}
                >
                  <td className={`px-4 py-3 text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.eligibilityType}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.enrolled.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.ada.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.meals.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.adpCount.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.adpPercentage.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {metric.participationPercentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};