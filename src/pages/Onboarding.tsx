import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Shield, 
  CreditCard, 
  Users, 
  Package, 
  Menu, 
  ClipboardList, 
  Box, 
  BarChart2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bot,
  Rocket,
  ArrowRight,
  Building,
  Settings,
  UserCog,
  FileCheck
} from 'lucide-react';

interface SetupTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  totalTasks: number;
  completedTasks: number;
  estimatedTime: string;
  tasks: SetupTask[];
}

const products: Product[] = [
  {
    id: 'operation',
    name: 'Operation',
    description: 'Configure district settings, programs, roles, and users',
    icon: Building,
    status: 'not-started',
    progress: 0,
    totalTasks: 6,
    completedTasks: 0,
    estimatedTime: '2 hours',
    tasks: [
      {
        id: 'op-1',
        title: 'District Profile',
        description: 'Set up district information, locations, and contact details',
        duration: '20 minutes',
        status: 'not-started'
      },
      {
        id: 'op-2',
        title: 'Programs Configuration',
        description: 'Configure nutrition programs and participation settings',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'op-3',
        title: 'System Settings',
        description: 'Configure system-wide settings and preferences',
        duration: '20 minutes',
        status: 'not-started'
      },
      {
        id: 'op-4',
        title: 'Role Management',
        description: 'Define user roles and permissions',
        duration: '20 minutes',
        status: 'not-started'
      },
      {
        id: 'op-5',
        title: 'User Management',
        description: 'Add and configure user accounts',
        duration: '15 minutes',
        status: 'not-started'
      },
      {
        id: 'op-6',
        title: 'Review and Verification',
        description: 'Review and verify all operational settings',
        duration: '15 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'accountability',
    name: 'Accountability',
    description: 'Program compliance and verification management',
    icon: Shield,
    status: 'in-progress',
    progress: 60,
    totalTasks: 5,
    completedTasks: 3,
    estimatedTime: '2 hours',
    tasks: [
      {
        id: 'acc-1',
        title: 'Configure Verification Settings',
        description: 'Set up verification sampling and tracking preferences',
        duration: '30 minutes',
        status: 'completed'
      },
      {
        id: 'acc-2',
        title: 'Set Up Document Templates',
        description: 'Configure verification letters and notification templates',
        duration: '45 minutes',
        status: 'completed'
      },
      {
        id: 'acc-3',
        title: 'Configure Reporting',
        description: 'Set up automated compliance reports and schedules',
        duration: '30 minutes',
        status: 'completed'
      },
      {
        id: 'acc-4',
        title: 'Staff Training',
        description: 'Complete staff training on verification procedures',
        duration: '1 hour',
        status: 'in-progress'
      },
      {
        id: 'acc-5',
        title: 'Review and Testing',
        description: 'Conduct system testing and review setup',
        duration: '30 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'pos',
    name: 'Point of Sale',
    description: 'Transaction and service point management',
    icon: CreditCard,
    status: 'not-started',
    progress: 0,
    totalTasks: 4,
    completedTasks: 0,
    estimatedTime: '3 hours',
    tasks: [
      {
        id: 'pos-1',
        title: 'Register Configuration',
        description: 'Set up POS terminals and hardware',
        duration: '1 hour',
        status: 'not-started'
      },
      {
        id: 'pos-2',
        title: 'Menu Setup',
        description: 'Configure menu items and pricing',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'pos-3',
        title: 'Payment Methods',
        description: 'Set up payment processing and methods',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'pos-4',
        title: 'Staff Training',
        description: 'Train staff on POS operations',
        duration: '30 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'eligibility',
    name: 'Eligibility',
    description: 'Student eligibility and benefit management',
    icon: Users,
    status: 'not-started',
    progress: 0,
    totalTasks: 5,
    completedTasks: 0,
    estimatedTime: '2.5 hours',
    tasks: [
      {
        id: 'elig-1',
        title: 'Application Configuration',
        description: 'Set up online and paper application processing',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'elig-2',
        title: 'Direct Certification Setup',
        description: 'Configure direct certification matching and imports',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'elig-3',
        title: 'Notification System',
        description: 'Set up eligibility notification preferences',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'elig-4',
        title: 'Benefit Management',
        description: 'Configure benefit assignment and tracking',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'elig-5',
        title: 'Staff Training',
        description: 'Train staff on eligibility procedures',
        duration: '15 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'menu-planning',
    name: 'Menu Planning',
    description: 'Plan and schedule menus',
    icon: Menu,
    status: 'not-started',
    progress: 0,
    totalTasks: 4,
    completedTasks: 0,
    estimatedTime: '3 hours',
    tasks: [
      {
        id: 'menu-1',
        title: 'Recipe Database',
        description: 'Set up recipe database and nutritional analysis',
        duration: '1 hour',
        status: 'not-started'
      },
      {
        id: 'menu-2',
        title: 'Menu Cycles',
        description: 'Configure menu cycles and rotation schedules',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'menu-3',
        title: 'Production Records',
        description: 'Set up production record templates',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'menu-4',
        title: 'Nutritional Reports',
        description: 'Configure nutritional analysis reports',
        duration: '30 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track and manage inventory',
    icon: Box,
    status: 'not-started',
    progress: 0,
    totalTasks: 5,
    completedTasks: 0,
    estimatedTime: '2.5 hours',
    tasks: [
      {
        id: 'inv-1',
        title: 'Item Database',
        description: 'Set up item database and categories',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'inv-2',
        title: 'Storage Locations',
        description: 'Configure storage locations and zones',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'inv-3',
        title: 'Ordering System',
        description: 'Set up ordering thresholds and vendors',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'inv-4',
        title: 'Count Procedures',
        description: 'Configure inventory count procedures',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'inv-5',
        title: 'Staff Training',
        description: 'Train staff on inventory procedures',
        duration: '15 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Kitchen production management',
    icon: ClipboardList,
    status: 'not-started',
    progress: 0,
    totalTasks: 4,
    completedTasks: 0,
    estimatedTime: '2 hours',
    tasks: [
      {
        id: 'prod-1',
        title: 'Production Sheets',
        description: 'Configure production sheet templates',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'prod-2',
        title: 'Batch Cooking',
        description: 'Set up batch cooking procedures',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'prod-3',
        title: 'Quality Control',
        description: 'Configure quality control checkpoints',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'prod-4',
        title: 'Staff Training',
        description: 'Train staff on production procedures',
        duration: '15 minutes',
        status: 'not-started'
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Operational metrics and management',
    icon: BarChart2,
    status: 'not-started',
    progress: 0,
    totalTasks: 4,
    completedTasks: 0,
    estimatedTime: '2 hours',
    tasks: [
      {
        id: 'ops-1',
        title: 'KPI Setup',
        description: 'Configure key performance indicators',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'ops-2',
        title: 'Financial Reports',
        description: 'Set up financial reporting templates',
        duration: '45 minutes',
        status: 'not-started'
      },
      {
        id: 'ops-3',
        title: 'Labor Management',
        description: 'Configure labor tracking and scheduling',
        duration: '30 minutes',
        status: 'not-started'
      },
      {
        id: 'ops-4',
        title: 'Staff Training',
        description: 'Train staff on operational procedures',
        duration: '15 minutes',
        status: 'not-started'
      }
    ]
  }
];

const TaskList: React.FC<{
  tasks: SetupTask[];
}> = ({ tasks }) => {
  const darkMode = useStore((state) => state.darkMode);

  const getActionButton = (task: SetupTask) => {
    switch (task.status) {
      case 'completed':
        return (
          <button
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-600 text-gray-300' 
                : 'bg-gray-200 text-gray-700'
            } cursor-default`}
            disabled
          >
            <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
            Completed
          </button>
        );
      case 'in-progress':
        return (
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            onClick={() => {/* Navigate to setup page */}}
          >
            Continue Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        );
      default:
        return (
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            onClick={() => {/* Navigate to setup page */}}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        );
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              ) : task.status === 'in-progress' ? (
                <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              )}
              <div>
                <h3 className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {task.description}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-sm">
                  <Clock className={`w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {task.duration}
                  </span>
                </div>
              </div>
            </div>
            {getActionButton(task)}
          </div>
        </div>
      ))}
    </div>
  );
};

const Onboarding = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {selectedProduct ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className={`flex items-center text-sm ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ← Back to Onboarding
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <selectedProduct.icon className={`w-8 h-8 ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <div>
                <h1 className={`text-2xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedProduct.name} Setup
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {selectedProduct.completedTasks} of {selectedProduct.totalTasks} tasks completed
                </p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Estimated time: {selectedProduct.estimatedTime}</span>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${
                  darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'
                } flex items-center justify-center`}>
                  <Bot className={`w-6 h-6 ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
              </div>
              <div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hi! I'll guide you through setting up {selectedProduct.name}. Complete these tasks in order to get started.
                </p>
              </div>
            </div>

            <TaskList tasks={selectedProduct.tasks} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Rocket className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h1 className={`text-2xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Onboarding
            </h1>
          </div>

          <div className="grid gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-sm overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <product.icon className={`w-8 h-8 ${
                        darkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                      <div>
                        <h3 className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'in-progress'
                        ? 'bg-amber-100 text-amber-800'
                        : product.status === 'on-hold'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {product.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Setup Progress
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {product.completedTasks}/{product.totalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${product.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Est. {product.estimatedTime}</span>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {product.status === 'completed' 
                        ? 'View Setup'
                        : product.status === 'in-progress'
                        ? 'Continue Setup'
                        : 'Start Setup'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;