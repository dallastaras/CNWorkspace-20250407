import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Grid, 
  Calendar as CalendarIcon, 
  CalendarDays, 
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addWeeks,
  subWeeks,
  getDay,
  addDays,
  isWeekend
} from 'date-fns';

interface Order {
  id: string;
  schoolName: string;
  managerName: string;
  itemCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  submittedAt: string;
}

interface DayOrders {
  [date: string]: Order[];
}

const Distribution = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    
    if (isWeekend(today)) {
      return addDays(startOfCurrentWeek, 7);
    }
    return startOfCurrentWeek;
  });

  const ordersByDate: DayOrders = {
    // February 2025
    '2025-02-10': [
      {
        id: '1',
        schoolName: 'Cybersoft High',
        managerName: 'Sarah Johnson',
        itemCount: 15,
        status: 'delivered',
        submittedAt: '2025-02-10T08:30:00Z'
      },
      {
        id: '2',
        schoolName: 'Primero Elementary',
        managerName: 'Maria Garcia',
        itemCount: 8,
        status: 'delivered',
        submittedAt: '2025-02-10T09:15:00Z'
      }
    ],
    '2025-02-12': [
      {
        id: '3',
        schoolName: 'Cybersoft Middle',
        managerName: 'Michael Chen',
        itemCount: 12,
        status: 'delivered',
        submittedAt: '2025-02-12T09:15:00Z'
      },
      {
        id: '4',
        schoolName: 'Primero High',
        managerName: 'Robert Wilson',
        itemCount: 14,
        status: 'delivered',
        submittedAt: '2025-02-12T10:00:00Z'
      }
    ],
    '2025-02-14': [
      {
        id: '5',
        schoolName: 'Cybersoft Elementary',
        managerName: 'Emily Rodriguez',
        itemCount: 10,
        status: 'delivered',
        submittedAt: '2025-02-14T08:45:00Z'
      }
    ],
    '2025-02-17': [
      {
        id: '6',
        schoolName: 'Cybersoft High',
        managerName: 'Sarah Johnson',
        itemCount: 16,
        status: 'approved',
        submittedAt: '2025-02-17T09:30:00Z'
      },
      {
        id: '7',
        schoolName: 'Primero High',
        managerName: 'Robert Wilson',
        itemCount: 13,
        status: 'approved',
        submittedAt: '2025-02-17T10:15:00Z'
      }
    ],
    '2025-02-19': [
      {
        id: '8',
        schoolName: 'Cybersoft Middle',
        managerName: 'Michael Chen',
        itemCount: 11,
        status: 'pending',
        submittedAt: '2025-02-19T08:30:00Z'
      },
      {
        id: '9',
        schoolName: 'Primero Elementary',
        managerName: 'Maria Garcia',
        itemCount: 9,
        status: 'pending',
        submittedAt: '2025-02-19T09:45:00Z'
      }
    ],
    '2025-02-21': [
      {
        id: '10',
        schoolName: 'Cybersoft Elementary',
        managerName: 'Emily Rodriguez',
        itemCount: 12,
        status: 'approved',
        submittedAt: '2025-02-21T08:15:00Z'
      }
    ],
    // March 2025
    '2025-03-03': [
      {
        id: '11',
        schoolName: 'Cybersoft High',
        managerName: 'Sarah Johnson',
        itemCount: 15,
        status: 'pending',
        submittedAt: '2025-03-03T08:30:00Z'
      },
      {
        id: '12',
        schoolName: 'Primero High',
        managerName: 'Robert Wilson',
        itemCount: 14,
        status: 'pending',
        submittedAt: '2025-03-03T09:15:00Z'
      }
    ],
    '2025-03-05': [
      {
        id: '13',
        schoolName: 'Cybersoft Middle',
        managerName: 'Michael Chen',
        itemCount: 13,
        status: 'approved',
        submittedAt: '2025-03-05T08:30:00Z'
      },
      {
        id: '14',
        schoolName: 'Primero Elementary',
        managerName: 'Maria Garcia',
        itemCount: 10,
        status: 'approved',
        submittedAt: '2025-03-05T09:30:00Z'
      }
    ],
    '2025-03-07': [
      {
        id: '15',
        schoolName: 'Cybersoft Elementary',
        managerName: 'Emily Rodriguez',
        itemCount: 11,
        status: 'pending',
        submittedAt: '2025-03-07T10:15:00Z'
      }
    ],
    '2025-03-10': [
      {
        id: '16',
        schoolName: 'Cybersoft High',
        managerName: 'Sarah Johnson',
        itemCount: 16,
        status: 'approved',
        submittedAt: '2025-03-10T08:45:00Z'
      },
      {
        id: '17',
        schoolName: 'Primero High',
        managerName: 'Robert Wilson',
        itemCount: 15,
        status: 'approved',
        submittedAt: '2025-03-10T09:30:00Z'
      }
    ],
    '2025-03-12': [
      {
        id: '18',
        schoolName: 'Cybersoft Middle',
        managerName: 'Michael Chen',
        itemCount: 12,
        status: 'pending',
        submittedAt: '2025-03-12T08:15:00Z'
      }
    ],
    '2025-03-14': [
      {
        id: '19',
        schoolName: 'Cybersoft Elementary',
        managerName: 'Emily Rodriguez',
        itemCount: 10,
        status: 'approved',
        submittedAt: '2025-03-14T09:00:00Z'
      },
      {
        id: '20',
        schoolName: 'Primero Elementary',
        managerName: 'Maria Garcia',
        itemCount: 9,
        status: 'approved',
        submittedAt: '2025-03-14T09:45:00Z'
      }
    ]
  };

  const getDateRange = () => {
    if (viewMode === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return { start, end };
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return { start, end };
    }
  };

  const { start, end } = getDateRange();
  
  const days = eachDayOfInterval({ start, end }).filter(day => {
    const dayOfWeek = getDay(day);
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  });

  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1)));
    } else {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    }
  };

  const getOrders = (date: Date): Order[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return ordersByDate[dateStr] || [];
  };

  const handleDayClick = (day: Date) => {
    const orders = getOrders(day);
    if (orders.length > 0) {
      navigate(`/distribution/daily/${format(day, 'yyyy-MM-dd')}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Grid className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Distribution Calendar
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/distribution/workflow')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Distribution
          </button>
          <button
            onClick={() => {/* Open new order form */}}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Order
          </button>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {viewMode === 'month' 
                  ? format(currentDate, 'MMMM yyyy')
                  : `Week of ${format(start, 'MMM d, yyyy')}`
                }
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`p-2 rounded-lg flex items-center ${
                    viewMode === 'month'
                      ? 'bg-indigo-600 text-white'
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Month view"
                >
                  <CalendarRange className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`p-2 rounded-lg flex items-center ${
                    viewMode === 'week'
                      ? 'bg-indigo-600 text-white'
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Week view"
                >
                  <CalendarDays className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateCalendar('prev')}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateCalendar('next')}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
              <div
                key={day}
                className={`text-center py-2 ${
                  darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
              </div>
            ))}

            {days.map((day) => {
              const orders = getOrders(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] relative ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } ${!isCurrentMonth && 'opacity-50'} ${
                    orders.length > 0 && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => orders.length > 0 && handleDayClick(day)}
                >
                  <div className={`px-3 py-2 ${isCurrentDay && 'font-bold'}`}>
                    <time
                      dateTime={format(day, 'yyyy-MM-dd')}
                      className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </time>
                    {orders.length > 0 && (
                      <div className="mt-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode 
                            ? 'bg-indigo-400/10 text-indigo-400' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {orders.length} orders
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distribution;