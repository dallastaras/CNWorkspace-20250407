import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  X, 
  Shield, 
  CreditCard, 
  Users, 
  Package, 
  Menu, 
  ClipboardList, 
  Box, 
  BarChart2,
  ArrowRight
} from 'lucide-react';

interface ModuleLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModuleLauncher: React.FC<ModuleLauncherProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);

  const modules = [
    { id: 'accountability', name: 'Accountability', icon: Shield, description: 'Track and manage program compliance', route: '/modules/accountability' },
    { id: 'pos', name: 'POS', icon: CreditCard, description: 'Point of sale and transaction management', route: '/modules/pos' },
    { id: 'eligibility', name: 'Eligibility', icon: Users, description: 'Student eligibility and benefit management', route: '/modules/eligibility' },
    { id: 'item-management', name: 'Item Management', icon: Package, description: 'Manage menu items and recipes', route: '/modules/item-management' },
    { id: 'menu-planning', name: 'Menu Planning', icon: Menu, description: 'Plan and schedule menus', route: '/modules/menu-planning' },
    { id: 'production', name: 'Production', icon: ClipboardList, description: 'Kitchen production management', route: '/modules/production' },
    { id: 'inventory', name: 'Inventory', icon: Box, description: 'Track and manage inventory', route: '/modules/inventory' },
    { id: 'operations', name: 'Operations', icon: BarChart2, description: 'Operational metrics and management', route: '/modules/operations' }
  ];

  const handleModuleClick = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-gray-500 transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-75' : 'opacity-0'
          }`} 
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className={`flex h-full flex-col overflow-y-scroll ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}>
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className={`text-xl font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Modules</h2>
                  <button
                    type="button"
                    className={`rounded-md ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-400 hover:text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="relative flex-1 px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-4">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.route)}
                      className={`flex items-start space-x-4 p-4 rounded-lg ${
                        darkMode
                          ? 'hover:bg-gray-700 text-left'
                          : 'hover:bg-gray-50 text-left'
                      } transition-colors w-full group`}
                    >
                      <div className="flex-shrink-0">
                        <module.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-base font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{module.name}</h3>
                        <p className={`mt-1 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{module.description}</p>
                      </div>
                      <ArrowRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLauncher;