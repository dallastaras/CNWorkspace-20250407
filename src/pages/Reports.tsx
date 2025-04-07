import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  FileText, 
  X,
  Search, 
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Mail,
  Printer,
  Clock,
  CheckCircle2,
  XCircle,
  Bot,
  AlertCircle
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'compliance' | 'nutritional';
  format: 'pdf' | 'excel' | 'csv';
  deliveryMethod: 'email' | 'print' | 'download';
  generatedAt: string;
  status: 'completed' | 'failed' | 'processing';
  size?: string;
  error?: string;
  previewUrl?: string;
}

const Reports = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Report['type']>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSchoolieInsights, setShowSchoolieInsights] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Sample data - replace with real data from API
  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Financial Summary',
      type: 'financial',
      format: 'excel',
      deliveryMethod: 'email',
      generatedAt: '2025-02-20T14:30:00Z',
      status: 'completed',
      size: '2.4 MB',
      previewUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop'
    },
    {
      id: '2',
      name: 'Daily Production Report',
      type: 'operational',
      format: 'pdf',
      deliveryMethod: 'print',
      generatedAt: '2025-02-20T15:45:00Z',
      status: 'completed',
      size: '1.8 MB',
      previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop'
    },
    {
      id: '3',
      name: 'Verification Summary',
      type: 'compliance',
      format: 'pdf',
      deliveryMethod: 'download',
      generatedAt: '2025-02-20T16:15:00Z',
      status: 'failed'
      //error: 'Missing required data'
    },
    {
      id: '4',
      name: 'Menu Nutritional Analysis',
      type: 'nutritional',
      format: 'excel',
      deliveryMethod: 'email',
      generatedAt: '2025-02-20T16:30:00Z',
      status: 'processing',
      previewUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1280&h=720&fit=crop'
    }
  ];

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'financial':
        return darkMode ? 'text-green-400 bg-green-400/10' : 'text-green-700 bg-green-100';
      case 'operational':
        return darkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-700 bg-blue-100';
      case 'compliance':
        return darkMode ? 'text-purple-400 bg-purple-400/10' : 'text-purple-700 bg-purple-100';
      case 'nutritional':
        return darkMode ? 'text-amber-400 bg-amber-400/10' : 'text-amber-700 bg-amber-100';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />;
      case 'failed':
        return <XCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />;
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-indigo-600" />
        );
    }
  };

  const getDeliveryIcon = (method: Report['deliveryMethod']) => {
    switch (method) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'print':
        return <Printer className="w-5 h-5" />;
      case 'download':
        return <Download className="w-5 h-5" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FileText className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Reports
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              View and download generated reports
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSchoolieInsights(!showSchoolieInsights)}
            className={`p-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
            title={showSchoolieInsights ? 'Hide Schoolie' : 'Show Schoolie'}
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSchoolieInsights && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                I notice that the Monthly Financial Summary was generated successfully and delivered via email. 
                However, the Verification Summary failed due to missing data. Would you like me to help you identify and resolve the missing information?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 pl-4 pr-10 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-900 hover:bg-gray-50'
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} relative`}
          >
            <Filter className="w-4 h-4" />
            <span>{filterType === 'all' ? 'All Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
            <ChevronDown className={`absolute right-3 w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
              darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
            }`}>
              {['all', 'financial', 'operational', 'compliance', 'nutritional'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type as any);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-left text-sm ${
                    filterType === type
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Report Name
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Type
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Format
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Delivery
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Generated
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Status
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
              darkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {report.name}
                        </div>
                        {report.error && (
                          <div className="flex items-center mt-1">
                            <AlertCircle className={`w-4 h-4 mr-1 ${
                              darkMode ? 'text-red-400' : 'text-red-600'
                            }`} />
                            <span className={`text-xs ${
                              darkMode ? 'text-red-400' : 'text-red-600'
                            }`}>
                              {report.error}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      getTypeColor(report.type)
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm uppercase ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {getDeliveryIcon(report.deliveryMethod)}
                      <span className="ml-2 capitalize">{report.deliveryMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Clock className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                        {new Date(report.generatedAt).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(report.status)}
                      <span className={`ml-2 text-sm capitalize ${
                        report.status === 'completed'
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : report.status === 'failed'
                          ? darkMode ? 'text-red-400' : 'text-red-600'
                          : darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {report.status === 'completed' && (
                      <button
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                        {report.size && <span className="ml-2 text-xs">({report.size})</span>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Panel */}
      {selectedReport && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setSelectedReport(null)}
            />
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-2xl">
                <div className={`flex h-full flex-col overflow-y-scroll ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-xl`}>
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedReport.name}
                        </h2>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            getTypeColor(selectedReport.type)
                          }`}>
                            {selectedReport.type}
                          </span>
                          <span className={`mx-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedReport.format.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`rounded-md ${
                          darkMode 
                            ? 'text-gray-400 hover:text-gray-300' 
                            : 'text-gray-400 hover:text-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        onClick={() => setSelectedReport(null)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="relative flex-1 px-4 py-6 sm:px-6">
                    {selectedReport.previewUrl ? (
                      <div className="h-full">
                        <img
                          src={selectedReport.previewUrl}
                          alt={selectedReport.name}
                          className="w-full rounded-lg shadow-lg"
                        />
                        {selectedReport.status === 'completed' && (
                          <div className="mt-4 flex justify-end">
                            <button
                              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                                darkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download {selectedReport.format.toUpperCase()}
                              {selectedReport.size && <span className="ml-2">({selectedReport.size})</span>}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center h-full ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <div className="text-center">
                          {selectedReport.status === 'failed' ? (
                            <>
                              <XCircle className="mx-auto h-12 w-12 text-red-500" />
                              <h3 className="mt-2 text-sm font-medium text-red-500">Report Generation Failed</h3>
                              {selectedReport.error && (
                                <p className="mt-1 text-sm text-gray-500">{selectedReport.error}</p>
                              )}
                            </>
                          ) : selectedReport.status === 'processing' ? (
                            <>
                              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-500 border-gray-200 mx-auto" />
                              <h3 className="mt-2 text-sm font-medium">Processing Report</h3>
                            </>
                          ) : (
                            <>
                              <FileText className="mx-auto h-12 w-12" />
                              <h3 className="mt-2 text-sm font-medium">No preview available</h3>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 sm:px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Generated {new Date(selectedReport.generatedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getDeliveryIcon(selectedReport.deliveryMethod)}
                        <span className={`ml-2 text-sm capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {selectedReport.deliveryMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;