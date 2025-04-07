import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { format, parseISO, subWeeks, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend, getWeek, startOfMonth, endOfMonth, isSameMonth, eachWeekOfInterval } from 'date-fns';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from 'recharts';
import { KPI, KPIValue } from '../../types';

interface PerformanceTrendsProps {
  kpis: KPI[];
  kpiValues: KPIValue[];
  selectedSchool: string;
  dateRange: { start: Date; end: Date };
}

export const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ 
  kpis, 
  kpiValues, 
  selectedSchool,
  dateRange
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);
  const [selectedKPI, setSelectedKPI] = useState(
    kpis.find(k => k.name === 'Meals Served')?.id || kpis[0]?.id
  );

  const chartData = useMemo(() => {
    if (!selectedKPI) return [];
    
    const kpi = kpis.find(k => k.id === selectedKPI);
    const values = kpiValues.filter(v => v.kpi_id === selectedKPI);
    
    if (['day', 'prior-day'].includes(selectedTimeframe)) {
      const currentDay = dateRange.start;
      const dayOfWeek = format(currentDay, 'EEEE');
      
      // Get the last 4 instances of this day of the week
      const lastFourWeeks = Array.from({ length: 4 }, (_, i) => subWeeks(currentDay, i));
      
      return lastFourWeeks.map(date => {
        const dayValues = values.filter(v => {
          const valueDate = parseISO(v.date);
          return isSameDay(valueDate, date);
        });

        const consolidatedValue = selectedSchool === 'district'
          ? dayValues.reduce((sum, val) => sum + val.value, 0) / (dayValues.length || 1)
          : dayValues[0]?.value || 0;

        return {
          date,
          label: isSameDay(date, currentDay) 
            ? 'This ' + dayOfWeek
            : format(date, 'MMM d'),
          value: consolidatedValue,
          trendValue: consolidatedValue,
          benchmark: kpi?.benchmark,
          goal: kpi?.goal,
          isAboveGoal: consolidatedValue >= (kpi?.goal || 0)
        };
      }).reverse(); // Show oldest to newest
    } else if (selectedTimeframe === 'week') {
      // For weekly view, show each day Monday-Friday
      const weekStart = startOfWeek(dateRange.start, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(dateRange.start, { weekStartsOn: 1 });
      
      // Get all days in the week
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
        .filter(day => !isWeekend(day)); // Filter out weekends
      
      return days.map(day => {
        const dayValues = values.filter(v => {
          const valueDate = parseISO(v.date);
          return format(valueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });

        const consolidatedValue = selectedSchool === 'district'
          ? dayValues.reduce((sum, val) => sum + val.value, 0) / (dayValues.length || 1)
          : dayValues[0]?.value || 0;

        return {
          date: day,
          label: format(day, 'EEE'), // 3-letter day name
          value: consolidatedValue,
          trendValue: consolidatedValue,
          benchmark: kpi?.benchmark,
          goal: kpi?.goal,
          isAboveGoal: consolidatedValue >= (kpi?.goal || 0)
        };
      });
    } else if (selectedTimeframe === 'month') {
      // For monthly view, get all weeks in the month
      const monthStart = startOfMonth(dateRange.start);
      const monthEnd = endOfMonth(dateRange.start);
      
      // Get all weeks in the month
      const weeks = eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 1 }
      );
      
      return weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        
        // Get all weekdays in this week that fall within the month
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
          .filter(day => !isWeekend(day) && isSameMonth(day, monthStart));
        
        // Get values for each day in the week
        const weekValues = weekDays.flatMap(day => 
          values.filter(v => {
            const valueDate = parseISO(v.date);
            return format(valueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
          })
        );
        
        // Calculate week average
        const weekAverage = weekValues.length > 0
          ? weekValues.reduce((sum, val) => sum + val.value, 0) / weekValues.length
          : 0;

        return {
          date: weekStart,
          label: `Week ${index + 1}`,
          value: weekAverage,
          trendValue: weekAverage,
          benchmark: kpi?.benchmark,
          goal: kpi?.goal,
          isAboveGoal: weekAverage >= (kpi?.goal || 0)
        };
      }).filter(week => week.value > 0); // Only include weeks with data
    }
    
    if (selectedTimeframe === 'year') {
      const monthlyData = values.reduce((acc, value) => {
        const date = parseISO(value.date);
        const month = format(date, 'MMM yy'); // Format as "Jul 24", "Aug 24", etc.
        
        if (!acc[month]) {
          acc[month] = {
            values: [],
            month,
            date,
            benchmark: kpi?.benchmark,
            goal: kpi?.goal,
          };
        }
        acc[month].values.push(value.value);
        return acc;
      }, {} as Record<string, any>);

      const monthlyValues = Object.values(monthlyData)
        .map(monthData => {
          const consolidatedValue = selectedSchool === 'district'
            ? monthData.values.reduce((sum: number, val: number) => sum + val, 0) / monthData.values.length
            : monthData.values[0];

          return {
            month: monthData.month,
            date: monthData.date,
            value: consolidatedValue,
            trendValue: consolidatedValue,
            benchmark: monthData.benchmark,
            goal: monthData.goal,
            isAboveGoal: consolidatedValue >= monthData.goal
          };
        });

      return monthlyValues.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    
    // For other timeframes, group by month
    const monthlyData = values.reduce((acc, value) => {
      const date = parseISO(value.date);
      const month = format(date, 'MMM yyyy');
      
      if (!acc[month]) {
        acc[month] = {
          values: [],
          month,
          date,
          benchmark: kpi?.benchmark,
          goal: kpi?.goal,
        };
      }
      acc[month].values.push(value.value);
      return acc;
    }, {} as Record<string, any>);

    // Calculate consolidated values for each month
    const monthlyValues = Object.values(monthlyData)
      .map(monthData => {
        const consolidatedValue = selectedSchool === 'district'
          ? monthData.values.reduce((sum: number, val: number) => sum + val, 0) / monthData.values.length
          : monthData.values[0];

        return {
          label: monthData.month,
          date: monthData.date,
          value: consolidatedValue,
          trendValue: consolidatedValue,
          benchmark: monthData.benchmark,
          goal: monthData.goal,
          isAboveGoal: consolidatedValue >= monthData.goal
        };
      });

    // Sort by date
    return monthlyValues.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [selectedKPI, kpis, kpiValues, selectedSchool, dateRange, selectedTimeframe]);

  const selectedKPIData = kpis.find(k => k.id === selectedKPI);

  const formatValue = (value: number) => {
    if (!selectedKPIData) return value.toLocaleString();

    if (selectedKPIData.unit === '%') return `${Math.round(value)}%`;
    if (selectedKPIData.unit === '$') return `$${value.toFixed(2)}`;
    
    // For specific KPIs that need whole numbers
    if (['Meals Served', 'Meals Per Labor Hour', 'Staff Training'].includes(selectedKPIData.name)) {
      return Math.round(value).toLocaleString();
    }
    
    // For specific KPIs that need 2 decimal places
    if (['Cost per Meal', 'Revenue Per Meal', 'Inventory Turnover'].includes(selectedKPIData.name)) {
      return value.toFixed(2);
    }
    
    // Default formatting for other numeric values
    return value.toLocaleString();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Performance Trends
        </h2>
        <select
          value={selectedKPI}
          onChange={(e) => setSelectedKPI(e.target.value)}
          className={`ml-4 px-3 py-2 border rounded-md text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-300' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {kpis.map(kpi => (
            <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
          ))}
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tickMargin={selectedTimeframe === 'year' ? 15 : 5}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Value') return formatValue(value);
                if (name === 'Trend') return formatValue(value);
                return value;
              }}
            />
            <Legend />
            <Bar
              name="Value"
              dataKey="value"
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.value >= entry.benchmark ? '#22c55e' : '#ef4444'}
                />
              ))}
            </Bar>
            <Line
              name="Trend"
              type="monotone"
              dataKey="trendValue"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              y={selectedKPIData?.benchmark}
              stroke="#6366f1"
              strokeDasharray="3 3"
              label={{ value: 'Benchmark', position: 'right' }}
            />
            <ReferenceLine
              y={selectedKPIData?.goal}
              stroke="#eab308"
              strokeDasharray="3 3"
              label={{ value: 'Goal', position: 'right' }}
            />
            {chartData.map((entry, index) => (
              entry.isAboveGoal && (
                <ReferenceLine
                  key={`star-${index}`}
                  x={entry.label}
                  stroke="none"
                  label={{
                    value: '⭐',
                    position: 'top',
                    offset: 10
                  }}
                />
              )
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};