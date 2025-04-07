import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Calendar,
  ChevronDown,
  Clock,
  CalendarDays,
  CalendarRange,
  History,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  BarChart2,
} from 'lucide-react';
import {
  format,
  subMonths,
  startOfYear,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns';

const timeframes = [
  {
    id: 'day',
    label: 'Today',
    icon: Clock,
    description: format(new Date(), 'MMMM d, yyyy'),
  },
  {
    id: 'prior-day',
    label: 'Yesterday',
    icon: History,
    description: format(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      'MMMM d, yyyy'
    ),
  },
  {
    id: 'week',
    label: 'This Week',
    icon: Calendar,
    description: `Week of ${format(new Date(), 'MMMM d')}`,
  },
  {
    id: 'last-week',
    label: 'Last Week',
    icon: Calendar,
    description: `Week of ${format(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      'MMMM d'
    )}`,
  },
  {
    id: 'month',
    label: 'This Month',
    icon: CalendarDays,
    description: format(new Date(), 'MMMM yyyy'),
  },
  {
    id: 'last-month',
    label: 'Last Month',
    icon: CalendarDays,
    description: format(subMonths(new Date(), 1), 'MMMM yyyy'),
  },
  {
    id: 'year',
    label: 'Year to Date',
    icon: CalendarRange,
    description: `${format(startOfYear(new Date()), 'MMMM yyyy')} - Present`,
  },
  {
    id: 'prior-year',
    label: 'Prior Year',
    icon: BookOpen,
    description: 'Previous academic year',
  },
  {
    id: 'all-years',
    label: 'All Years',
    icon: BarChart2,
    description: 'Historical year-over-year data',
  },
  {
    id: 'custom',
    label: 'Custom Range',
    icon: Calendar,
    description: 'Select a custom date range',
  },
];

export const TimeframeSelector = () => {
  const {
    selectedTimeframe,
    setSelectedTimeframe,
    customDateRange,
    setCustomDateRange,
  } = useStore();
  const darkMode = useStore((state) => state.darkMode);
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    customDateRange?.start || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    customDateRange?.end || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption =
    timeframes.find((t) => t.id === selectedTimeframe) || timeframes[0];
  const Icon = selectedOption.icon;

  const handleDateRangeSelect = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      debugger;
      setCustomDateRange({ start, end });
      setSelectedTimeframe('custom');
      setIsOpen(false);
      setShowDatePicker(false);
    }
  };

  const getCustomRangeDescription = () => {
    if (!customDateRange?.start || !customDateRange?.end) return 'Select dates';
    return `${format(customDateRange.start, 'MMM d, yyyy')} - ${format(
      customDateRange.end,
      'MMM d, yyyy'
    )}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          darkMode
            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } transition-colors border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedTimeframe === 'custom'
            ? 'Custom Range'
            : selectedOption.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && !showDatePicker && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-50 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="py-2">
            {timeframes.map((timeframe) => {
              const TimeframeIcon = timeframe.icon;
              const isSelected = selectedTimeframe === timeframe.id;

              return (
                <button
                  key={timeframe.id}
                  onClick={() => {
                    if (timeframe.id === 'custom') {
                      setShowDatePicker(true);
                    } else {
                      setSelectedTimeframe(timeframe.id as any);
                      if (timeframe.id !== 'custom') {
                        setCustomDateRange(null);
                      }
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-start px-4 py-2 text-left ${
                    isSelected
                      ? darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TimeframeIcon
                    className={`w-4 h-4 mt-0.5 ${
                      isSelected
                        ? darkMode
                          ? 'text-white'
                          : 'text-indigo-600'
                        : darkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  />
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        isSelected
                          ? darkMode
                            ? 'text-white'
                            : 'text-indigo-600'
                          : darkMode
                          ? 'text-gray-200'
                          : 'text-gray-900'
                      }`}
                    >
                      {timeframe.label}
                    </div>
                    <div
                      className={`text-xs ${
                        isSelected
                          ? darkMode
                            ? 'text-gray-300'
                            : 'text-indigo-500'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {timeframe.id === 'custom' &&
                      selectedTimeframe === 'custom'
                        ? getCustomRangeDescription()
                        : timeframe.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showDatePicker && (
        <div
          className={`absolute right-0 mt-2 p-4 rounded-lg shadow-lg z-50 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Select Date Range
            </h3>
            <button
              onClick={() => {
                setShowDatePicker(false);
                setIsOpen(false);
              }}
              className={`p-1 rounded-lg ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeSelect}
            maxDate={new Date()}
            minDate={addDays(new Date(), -365)} // Limit to past year
            monthsShown={2}
            inline
            calendarClassName={darkMode ? 'dark-theme' : ''}
          />
        </div>
      )}

      <style>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          border: none;
          ${
            darkMode
              ? `
            background-color: #1f2937;
            color: #e5e7eb;
          `
              : ''
          }
        }
        
        .react-datepicker__header {
          background-color: ${darkMode ? '#111827' : '#f3f4f6'};
          border-bottom: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .react-datepicker__current-month {
          color: ${darkMode ? '#e5e7eb' : 'inherit'};
        }
        
        .react-datepicker__day-name {
          color: ${darkMode ? '#9ca3af' : 'inherit'};
        }
        
        .react-datepicker__day {
          color: ${darkMode ? '#e5e7eb' : 'inherit'};
        }
        
        .react-datepicker__day:hover {
          background-color: ${darkMode ? '#374151' : '#f3f4f6'};
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: #4f46e5 !important;
          color: white !important;
        }
        
        .react-datepicker__day--keyboard-selected {
          background-color: ${darkMode ? '#374151' : '#e5e7eb'};
          color: ${darkMode ? '#e5e7eb' : 'inherit'};
        }
        
        .react-datepicker__day--disabled {
          color: ${darkMode ? '#4b5563' : '#9ca3af'};
        }
      `}</style>
    </div>
  );
};
