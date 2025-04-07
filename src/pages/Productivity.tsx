import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Clock, 
  CheckSquare, 
  Bell, 
  Repeat,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Star
} from 'lucide-react';

const Productivity = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'reminders' | 'routines'>('schedule');

  const renderSchedule = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Today</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Week</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Month</button>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <Calendar className="w-full h-64" />
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search tasks..."
            className={`pl-10 pr-4 py-2 w-full rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <div className="flex space-x-2">
          <button className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
            <Filter className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add Task
          </button>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {[1, 2, 3].map((task) => (
          <div key={task} className="p-4 flex items-center space-x-4">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Review menu plan for next week
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due tomorrow</p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gray-400" />
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReminders = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>All</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Important</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Completed</button>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Set Reminder
        </button>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {[1, 2, 3].map((reminder) => (
          <div key={reminder} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Monthly inventory check
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tomorrow at 9:00 AM
                  </p>
                </div>
              </div>
              <button className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoutines = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Daily</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Weekly</button>
          <button className={`px-4 py-2 text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>Monthly</button>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create Routine
        </button>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {[1, 2, 3].map((routine) => (
          <div key={routine} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Repeat className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Daily production report
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Every weekday at 4:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                }`}>Active</span>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Productivity
        </h1>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'routines', label: 'Routines', icon: Repeat }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${activeTab === id
                  ? `${darkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                  : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'reminders' && renderReminders()}
      {activeTab === 'routines' && renderRoutines()}
    </div>
  );
};

export default Productivity;