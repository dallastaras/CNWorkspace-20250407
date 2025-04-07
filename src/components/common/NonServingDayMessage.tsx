import React from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface NonServingDayMessageProps {
  date: Date;
  reason: 'weekend' | 'holiday';
}

export const NonServingDayMessage: React.FC<NonServingDayMessageProps> = ({ date, reason }) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Calendar className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>
        <div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Data Available
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {format(date, 'MMMM d, yyyy')} is a {reason === 'weekend' ? 'weekend' : 'holiday'}, 
            which is a non-serving day. No meal service data is available.
          </p>
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                To view meal service data, please select a different time period using the filters above.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};