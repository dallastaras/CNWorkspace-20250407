import React from 'react';
import { useStore } from '../../../store/useStore';
import { Building } from 'lucide-react';

interface EnrollmentBreakdown {
  totalEnrollment: number;
  freeCount: number;
  reducedCount: number;
  paidCount: number;
}

interface SchoolEnrollment extends EnrollmentBreakdown {
  schoolName: string;
}

interface EnrollmentDetailsProps extends EnrollmentBreakdown {
  schoolBreakdown?: SchoolEnrollment[];
  isDistrictView: boolean;
}

export const EnrollmentDetails: React.FC<EnrollmentDetailsProps> = ({
  totalEnrollment = 0,
  freeCount = 0,
  reducedCount = 0,
  paidCount = 0,
  schoolBreakdown = [],
  isDistrictView
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const calculatePercentage = (count: number, total: number = totalEnrollment) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  // Deduplicate and validate school breakdown data
  const uniqueSchools = new Map<string, SchoolEnrollment>();
  schoolBreakdown.forEach(school => {
    if (!uniqueSchools.has(school.schoolName)) {
      // Ensure counts add up to total enrollment for each school
      const validatedSchool = {
        ...school,
        // Ensure paid count is calculated as the remainder
        paidCount: school.totalEnrollment - (school.freeCount + school.reducedCount)
      };
      uniqueSchools.set(school.schoolName, validatedSchool);
    }
  });

  // Calculate district totals from school breakdown if in district view
  const districtTotals = isDistrictView ? Array.from(uniqueSchools.values()).reduce(
    (acc, school) => ({
      totalEnrollment: acc.totalEnrollment + school.totalEnrollment,
      freeCount: acc.freeCount + school.freeCount,
      reducedCount: acc.reducedCount + school.reducedCount,
      paidCount: acc.paidCount + school.paidCount
    }),
    { totalEnrollment: 0, freeCount: 0, reducedCount: 0, paidCount: 0 }
  ) : null;

  // Use district totals if available, otherwise use props
  const displayTotals = districtTotals || {
    totalEnrollment,
    freeCount,
    reducedCount,
    paidCount
  };


  const MetricCard: React.FC<{
    label: string;
    count: number;
  }> = ({ label, count }) => (
    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {label}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {calculatePercentage(count, displayTotals.totalEnrollment)} of enrollment
            </p>
          </div>
        </div>
        <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Eligibility Summary
      </h3>
      {/* Eligibility Summary Table */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
        <table className="min-w-full">
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Category
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Students
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <tr>
              <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Free Eligible
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {displayTotals.freeCount.toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {calculatePercentage(displayTotals.freeCount)}%
              </td>
            </tr>
            <tr>
              <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Reduced Eligible
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {displayTotals.reducedCount.toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {calculatePercentage(displayTotals.reducedCount)}%
              </td>
            </tr>
            <tr>
              <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Paid
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {displayTotals.paidCount.toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {calculatePercentage(displayTotals.paidCount)}%
              </td>
            </tr>
            <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} font-medium`}>
              <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Total Enrollment
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {displayTotals.totalEnrollment.toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                100%
              </td>
            </tr>
            <tr className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} font-medium`}>
              <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Total Free/Reduced
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {(displayTotals.freeCount + displayTotals.reducedCount).toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {calculatePercentage(displayTotals.freeCount + displayTotals.reducedCount)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* School Breakdown - Only show in district view */}
      {isDistrictView && uniqueSchools.size > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 mb-4">
            <Building className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Eligibility by School
            </h3>
          </div>
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      School
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Free
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Reduced
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Paid
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                  {Array.from(uniqueSchools.values()).map((school) => (
                    <tr key={school.schoolName}>
                      <td className={`px-4 py-3 text-sm ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.schoolName}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.freeCount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.reducedCount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.paidCount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.totalEnrollment.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};