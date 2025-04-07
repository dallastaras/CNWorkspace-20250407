import React from 'react';
import { useStore } from '../../../store/useStore';
import {
  Trash2,
  RefreshCw,
  MoveRight,
  Scale,
  DollarSign,
  AlertTriangle,
  Thermometer,
} from 'lucide-react';

interface WasteMetrics {
  planned: number;
  produced: number;
  served: number;
  waste: number;
  rts: number; // Returned to Stock
  carryOver: number;
  leftOver: number;
  spoilage?: {
    temperature: number;
    quality: number;
    expired: number;
  };
}

interface FoodWasteDetailsProps {
  metrics: WasteMetrics;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const FoodWasteDetails: React.FC<FoodWasteDetailsProps> = ({
  metrics,
  dateRange,
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Calculate percentages and financial impact
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
  };

  const productionAccuracy =
    metrics.produced > 0
      ? (
          (1 - Math.abs(metrics.produced - metrics.planned) / metrics.planned) *
          100
        ).toFixed(2)
      : '0.00';

  const servingAccuracy =
    metrics.produced > 0
      ? ((metrics.served / metrics.produced) * 100).toFixed(2)
      : '0.00';

  const wastePercentage = calculatePercentage(metrics.waste, metrics.produced);
  const rtsPercentage = calculatePercentage(metrics.rts, metrics.produced);
  const carryOverPercentage = calculatePercentage(
    metrics.carryOver,
    metrics.produced
  );
  const leftOverPercentage = calculatePercentage(
    metrics.leftOver,
    metrics.produced
  );

  // Calculate total spoilage
  const totalSpoilage = metrics.spoilage
    ? metrics.spoilage.temperature +
      metrics.spoilage.quality +
      metrics.spoilage.expired
    : 0;
  const spoilagePercentage = calculatePercentage(
    totalSpoilage,
    metrics.produced
  );

  // Calculate financial impact (assuming average cost of $2.50 per portion)
  const costPerPortion = 2.5;
  const wastedValue = metrics.waste * costPerPortion;
  const spoilageValue = totalSpoilage * costPerPortion;
  const rtsValue = metrics.rts * costPerPortion;
  const carryOverValue = metrics.carryOver * costPerPortion;
  const totalImpact = wastedValue + spoilageValue + carryOverValue * 0.5; // Assume 50% value loss on carry over

  return (
    <div className="space-y-6">
      {/* Production Overview */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Production Overview
        </h3>
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className={`px-4 py-2 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Category
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Portions
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Percentage
                  </th>
                  <th className={`px-4 py-2 text-right text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <tr>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Planned
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {metrics.planned.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    100%
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Baseline
                  </td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Produced
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {metrics.produced.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {productionAccuracy}%
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    parseFloat(productionAccuracy) >= 90
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}>
                    {parseFloat(productionAccuracy) >= 90 ? 'On Target' : 'Review Needed'}
                  </td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Served
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {metrics.served.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {servingAccuracy}%
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    parseFloat(servingAccuracy) >= 90
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}>
                    {parseFloat(servingAccuracy) >= 90 ? 'Good' : 'Needs Attention'}
                  </td>
                </tr>
                <tr>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Total Waste
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {(metrics.waste + totalSpoilage).toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {(parseFloat(wastePercentage) + parseFloat(spoilagePercentage)).toFixed(2)}%
                  </td>
                  <td className={`px-4 py-3 text-right text-sm ${
                    parseFloat(wastePercentage) + parseFloat(spoilagePercentage) <= 5
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {parseFloat(wastePercentage) + parseFloat(spoilagePercentage) <= 5 ? 'Acceptable' : 'High'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Financial Impact */}
        <div
          className={`${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-600' : 'bg-white'
              }`}
            >
              <DollarSign
                className={`w-5 h-5 ${
                  totalImpact > 1000
                    ? darkMode
                      ? 'text-red-400'
                      : 'text-red-600'
                    : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              />
            </div>
            <div>
              <div
                className={`font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Financial Impact
              </div>
              <div
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } mt-1`}
              >
                Total value of wasted food: $
                {totalImpact.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                } mt-1`}
              >
                Includes{' '}
                {metrics.spoilage
                  ? `spoilage ($${spoilageValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })})`
                  : ''}
                {metrics.spoilage ? ', ' : ''}
                discarded food ($
                {wastedValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                ), and carry over loss ($
                {(carryOverValue * 0.5).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                )
              </div>
              {totalImpact > 1000 && (
                <div className="mt-2 flex items-start space-x-2">
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 ${
                      darkMode ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  >
                    High waste cost detected. Consider reviewing production
                    planning, storage procedures, and portion control.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown -- Hide for now
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Leftover Breakdown
        </h3>
        <div
          className={`${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          } rounded-lg divide-y ${
            darkMode ? 'divide-gray-600' : 'divide-gray-200'
          }`}
        >
          
          {metrics.spoilage && (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-white'
                    }`}
                  >
                    <Thermometer
                      className={`w-5 h-5 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      Spoilage
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {totalSpoilage.toLocaleString()} portions (
                      {spoilagePercentage}%)
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      } mt-1`}
                    >
                      Temperature: {metrics.spoilage.temperature} · Quality:{' '}
                      {metrics.spoilage.quality} · Expired:{' '}
                      {metrics.spoilage.expired}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-right ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  -$
                  {spoilageValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  }`}
                >
                  <Trash2
                    className={`w-5 h-5 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}
                  >
                    Discarded Food
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {metrics.waste.toLocaleString()} portions ({wastePercentage}
                    %)
                  </div>
                </div>
              </div>
              <div
                className={`text-right ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}
              >
                -$
                {wastedValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  }`}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}
                  >
                    Returned to Stock
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {metrics.rts.toLocaleString()} portions ({rtsPercentage}%)
                  </div>
                </div>
              </div>
              <div
                className={`text-right ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                $
                {rtsValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  }`}
                >
                  <MoveRight
                    className={`w-5 h-5 ${
                      darkMode ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}
                  >
                    Carry Over
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {metrics.carryOver.toLocaleString()} portions (
                    {carryOverPercentage}%)
                  </div>
                </div>
              </div>
              <div
                className={`text-right ${
                  darkMode ? 'text-amber-400' : 'text-amber-600'
                }`}
              >
                -$
                {(carryOverValue * 0.5).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
       */}

    </div>
  );
};
