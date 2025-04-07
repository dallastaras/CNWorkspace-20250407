import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Shield, 
  CreditCard, 
  Users, 
  Menu as MenuIcon, 
  ClipboardList, 
  Box, 
  BarChart2, 
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Building,
  Check,
  Package,
  X,
  Calendar,
  Phone,
  School
} from 'lucide-react';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface License {
  schoolId: string;
  schoolName: string;
  deviceCount?: number;
  active: boolean;
  expiresAt: string;
}

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  licenseType: 'district' | 'school' | 'device';
  status: 'active' | 'inactive';
  purchased: boolean;
  licenses?: License[];
  premiumFeatures: PremiumFeature[];
}

const Products = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{
    moduleId: string;
    feature: PremiumFeature;
  } | null>(null);

  const modules: Module[] = [
    {
      id: 'operation',
      name: 'Operation',
      icon: Building,
      description: 'District-wide operational configuration and management',
      licenseType: 'district',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'district',
          schoolName: 'Cybersoft ISD',
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'multi-district',
          name: 'Multi-District Management',
          description: 'Manage multiple districts from a single dashboard',
          enabled: false
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'Deep insights and predictive analytics for operations',
          enabled: false
        }
      ]
    },
    {
      id: 'accountability',
      name: 'Accountability',
      icon: Shield,
      description: 'Program compliance and verification management',
      licenseType: 'district',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'district',
          schoolName: 'Cybersoft ISD',
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'auto-verification',
          name: 'Automated Verification',
          description: 'AI-powered verification process that saves time and reduces errors',
          enabled: false
        },
        {
          id: 'advanced-reporting',
          name: 'Advanced Reporting',
          description: 'Comprehensive reporting tools with custom templates',
          enabled: false
        }
      ]
    },
    {
      id: 'pos',
      name: 'Point of Sale',
      icon: CreditCard,
      description: 'Transaction and service point management',
      licenseType: 'device',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'cs-high',
          schoolName: 'Cybersoft High',
          deviceCount: 4,
          active: true,
          expiresAt: '2025-06-30'
        },
        {
          schoolId: 'cs-middle',
          schoolName: 'Cybersoft Middle',
          deviceCount: 3,
          active: true,
          expiresAt: '2025-06-30'
        },
        {
          schoolId: 'cs-elem',
          schoolName: 'Cybersoft Elementary',
          deviceCount: 2,
          active: true,
          expiresAt: '2025-06-30'
        },
        {
          schoolId: 'primero-high',
          schoolName: 'Primero High',
          deviceCount: 3,
          active: true,
          expiresAt: '2025-06-30'
        },
        {
          schoolId: 'primero-elem',
          schoolName: 'Primero Elementary',
          deviceCount: 2,
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'mobile-pos',
          name: 'Mobile POS',
          description: 'Process transactions from any mobile device',
          enabled: false
        },
        {
          id: 'offline-mode',
          name: 'Offline Mode',
          description: 'Continue operations without internet connection',
          enabled: false
        }
      ]
    },
    {
      id: 'eligibility',
      name: 'Eligibility',
      icon: Users,
      description: 'Student eligibility and benefit management',
      licenseType: 'district',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'district',
          schoolName: 'Cybersoft ISD',
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'bulk-processing',
          name: 'Bulk Processing',
          description: 'Process multiple applications simultaneously',
          enabled: false
        },
        {
          id: 'direct-certification',
          name: 'Direct Certification Integration',
          description: 'Automated matching with state databases',
          enabled: false
        }
      ]
    },
    {
      id: 'menu-planning',
      name: 'Menu Planning',
      icon: MenuIcon,
      description: 'Plan and schedule menus',
      licenseType: 'district',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'district',
          schoolName: 'Cybersoft ISD',
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'ai-menu-suggestions',
          name: 'AI Menu Suggestions',
          description: 'Get smart menu recommendations based on historical data',
          enabled: false
        },
        {
          id: 'nutritional-analysis',
          name: 'Advanced Nutritional Analysis',
          description: 'Detailed nutritional breakdown and optimization',
          enabled: false
        }
      ]
    },
    {
      id: 'production',
      name: 'Production',
      icon: ClipboardList,
      description: 'Kitchen production management',
      licenseType: 'school',
      status: 'inactive',
      purchased: false,
      licenses: [],
      premiumFeatures: [
        {
          id: 'recipe-scaling',
          name: 'Smart Recipe Scaling',
          description: 'Automatically adjust recipes based on production needs',
          enabled: false
        },
        {
          id: 'waste-tracking',
          name: 'Advanced Waste Tracking',
          description: 'Detailed waste analysis and reduction recommendations',
          enabled: false
        }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Box,
      description: 'Track and manage inventory',
      licenseType: 'school',
      status: 'inactive',
      purchased: false,
      licenses: [],
      premiumFeatures: [
        {
          id: 'barcode-scanning',
          name: 'Barcode Scanning',
          description: 'Scan items for quick inventory management',
          enabled: false
        },
        {
          id: 'predictive-ordering',
          name: 'Predictive Ordering',
          description: 'AI-powered order suggestions based on usage patterns',
          enabled: false
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: BarChart2,
      description: 'Operational metrics and management',
      licenseType: 'district',
      status: 'active',
      purchased: true,
      licenses: [
        {
          schoolId: 'district',
          schoolName: 'Cybersoft ISD',
          active: true,
          expiresAt: '2025-06-30'
        }
      ],
      premiumFeatures: [
        {
          id: 'advanced-forecasting',
          name: 'Advanced Forecasting',
          description: 'AI-powered operational forecasting and planning',
          enabled: false
        },
        {
          id: 'custom-dashboards',
          name: 'Custom Dashboards',
          description: 'Create personalized operational dashboards',
          enabled: false
        }
      ]
    }
  ];

  const handleModuleToggle = (moduleId: string) => {
    if (!modules.find(m => m.id === moduleId)?.purchased) {
      setSelectedFeature({
        moduleId,
        feature: { id: 'module', name: '', description: '', enabled: false }
      });
      return;
    }
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleFeatureToggle = (moduleId: string, feature: PremiumFeature) => {
    if (!feature.enabled) {
      setSelectedFeature({ moduleId, feature });
    } else {
      // Directly disable the feature
      const updatedModules = modules.map(module => 
        module.id === moduleId
          ? {
              ...module,
              premiumFeatures: module.premiumFeatures.map(f =>
                f.id === feature.id ? { ...f, enabled: false } : f
              )
            }
          : module
      );
      // Update modules state here
    }
  };

  const getLicenseTypeLabel = (type: Module['licenseType']) => {
    switch (type) {
      case 'district':
        return 'Licensed per district';
      case 'school':
        return 'Licensed per school';
      case 'device':
        return 'Licensed per school and device';
    }
  };

  const getLicenseSummary = (module: Module) => {
    if (!module.licenses?.length) return null;

    switch (module.licenseType) {
      case 'district':
        return `Licensed for all schools in your district`;
      case 'school':
        return `${module.licenses.length} of 5 schools enabled`;
      case 'device': {
        const totalDevices = module.licenses.reduce((sum, license) => sum + (license.deviceCount || 0), 0);
        return `All ${module.licenses.length} schools enabled with ${totalDevices} device licenses`;
      }
      default:
        return null;
    }
  };

  const renderLicenseInfo = (module: Module) => {
    if (!module.licenses?.length) return null;

    return (
      <div className={`mt-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            License Status
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
          }`}>
            Active until {new Date(module.licenses[0].expiresAt).toLocaleDateString()}
          </span>
        </div>
        
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {getLicenseSummary(module)}
        </p>

        {module.licenseType === 'device' && (
          <div className="mt-3 space-y-2">
            {module.licenses.map((license) => (
              <div 
                key={license.schoolId}
                className={`flex items-center justify-between text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <span>{license.schoolName}</span>
                <span>{license.deviceCount} devices</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Package className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Products
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {modules.map((module) => (
          <div key={module.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
            <div 
              className="p-6 cursor-pointer"
              onClick={() => handleModuleToggle(module.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <module.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {module.name}
                      </h3>
                      {module.purchased && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          module.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {module.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {module.description}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {getLicenseTypeLabel(module.licenseType)}
                    </p>
                  </div>
                </div>
                {module.purchased ? (
                  <button className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expandedModule === module.id ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>

            {module.purchased && expandedModule === module.id && (
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                {renderLicenseInfo(module)}
                
                <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mt-6 mb-4`}>
                  Premium Features
                </h4>
                <div className="space-y-4">
                  {module.premiumFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 ${feature.enabled ? 'text-yellow-400' : 'text-gray-300'} mr-2`} />
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {feature.name}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-6`}>
                          {feature.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFeatureToggle(module.id, feature)}
                        className={`ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          feature.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Toggle feature</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            feature.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trial Confirmation Dialog */}
      {selectedFeature && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className={`inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6`}>
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedFeature.feature.id === 'module' 
                      ? 'Try This Product'
                      : 'Try Premium Feature'}
                  </h3>
                  <div className="mt-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      This {selectedFeature.feature.id === 'module' ? 'product' : 'feature'} can be trialed for a week. 
                      Your license and purchase order will be adjusted if you continue to use it. 
                      Would you like to start a trial or schedule a demo first?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedFeature(null)}
                >
                  Setup my free trial
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedFeature(null)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  I'll schedule a demo
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setSelectedFeature(null)}
                >
                  I'll wait
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;