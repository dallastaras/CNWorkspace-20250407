import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Home, 
  Briefcase, 
  BarChart2,
  DollarSign,
  Utensils, 
  Inbox, 
  Clock, 
  Target, 
  GraduationCap, 
  Package, 
  Bot, 
  Settings, 
  Users, 
  Rocket,
  Truck,
  FileText,
  Camera,
  CheckSquare,
  Apple
} from 'lucide-react';

interface NavigationProps {
  mobile?: boolean;
  onNavClick?: () => void;
  collapsed?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ mobile, onNavClick, collapsed }) => {
  const darkMode = useStore((state) => state.darkMode);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Workspace' },
    /* { to: '/my-work', icon: Briefcase, label: 'My Work' }, */
    { to: '/insights', icon: BarChart2, label: 'Insights' },
    /* { to: '/inbox', icon: Inbox, label: 'Inbox' }, */
    { to: '/menu-planner', icon: Utensils, label: 'Menu Analysis' },
    /* { to: '/financials', icon: DollarSign, label: 'Financials' }, */
   { to: '/oversight', icon: FileText, label: 'Oversight' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    /* { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/learning', icon: GraduationCap, label: 'Learning' }
    { to: '/digitize', icon: Camera, label: 'Digitize' },
    { to: '/special-diets', icon: Apple, label: 'Special Diets' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/distribution', icon: Truck, label: 'Distribution' }, 
    { to: '/onboarding', icon: Rocket, label: 'Onboarding' },
    { to: '/community', icon: Users, label: 'Community' }, 
    { to: '/chat', icon: Bot, label: 'AI Assistant' }, 
    { to: '/settings', icon: Settings, label: 'Settings' }, */
  ];

  return (
    <div className={`${!mobile ? 'border-r h-full w-full' : ''} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <nav className={`${!mobile && !collapsed ? 'pt-8' : 'pt-4'}`}>
        <div className="px-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavClick}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? darkMode
                      ? 'bg-gray-900 text-indigo-400'
                      : 'bg-indigo-100 text-indigo-700'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${collapsed && !mobile ? 'justify-center' : ''}`
              }
            >
              <div className={`flex items-center ${collapsed && !mobile ? 'justify-center' : 'flex-1'}`}>
                <Icon className={`mr-3 h-5 w-5 ${
                  collapsed && !mobile ? 'mr-0' : 'mr-3'
                } h-5 w-5 ${
                  darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {(!collapsed || mobile) && label}
              </div>
              {badge && (
                <span className={`${badgeColor} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;