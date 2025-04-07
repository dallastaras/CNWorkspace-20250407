import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ExternalLink, ArrowLeft, FileText, FileSpreadsheet, File as FilePdf, Presentation as FilePresentation, Link2, ChevronRight, Video } from 'lucide-react';

interface ResourceDownload {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'link';
  size?: string;
}

interface ResourceSection {
  title: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
    downloads?: ResourceDownload[];
  }[];
  downloads?: ResourceDownload[];
}

interface ResourceContent {
  title: string;
  description: string;
  sections: ResourceSection[];
  sourceUrl: string;
}

const getFileIcon = (type: ResourceDownload['type']) => {
  switch (type) {
    case 'pdf':
      return FilePdf;
    case 'doc':
      return FileText;
    case 'xls':
      return FileSpreadsheet;
    case 'ppt':
      return FilePresentation;
    case 'video':
      return Video;
    default:
      return Link2;
  }
};

const resourceContents: Record<string, ResourceContent> = {
  nslp: {
    title: 'National School Lunch Program',
    description: 'A comprehensive guide to understanding and implementing the National School Lunch Program in your schools.',
    sections: [
      {
        title: 'Program Overview',
        content: [
          'The National School Lunch Program (NSLP) is a federally assisted meal program operating in public and nonprofit private schools and residential child care institutions.',
          'It provides nutritionally balanced, low-cost or free lunches to children each school day.',
          'The program was established under the National School Lunch Act, signed by President Harry Truman in 1946.'
        ],
        downloads: [
          {
            title: 'NSLP Fact Sheet',
            description: 'Overview of program requirements and benefits',
            url: 'https://theicn.org/resources/325/nslp-fact-sheet',
            type: 'pdf',
            size: '2.1 MB'
          }
        ]
      },
      {
        title: 'Program Requirements',
        content: [
          'Schools must serve lunches that meet Federal meal pattern requirements.',
          'Schools must offer free or reduced-price lunches to eligible children.',
          'Schools must operate as non-profit food service.'
        ],
        subsections: [
          {
            title: 'Meal Pattern Requirements',
            content: [
              'Meals must meet specific calorie ranges for each age/grade group.',
              'Weekly requirements for grains and meat/meat alternates.',
              'Daily fruit and vegetable requirements.'
            ],
            downloads: [
              {
                title: 'Meal Pattern Calculator',
                description: 'Excel tool for planning compliant meals',
                url: 'https://theicn.org/resources/meal-pattern-calculator',
                type: 'xls',
                size: '1.8 MB'
              }
            ]
          },
          {
            title: 'Food Safety Requirements',
            content: [
              'Implementation of food safety program based on HACCP principles',
              'Regular food safety inspections',
              'Proper food handling and storage procedures'
            ],
            downloads: [
              {
                title: 'Food Safety Checklist',
                description: 'Daily food safety monitoring checklist',
                url: 'https://theicn.org/resources/food-safety-checklist',
                type: 'doc',
                size: '245 KB'
              }
            ]
          }
        ]
      },
      {
        title: 'Training Resources',
        content: [
          'Access comprehensive training materials for staff development.',
          'Online courses and webinars available for continuing education.',
          'Professional development tracking tools.'
        ],
        downloads: [
          {
            title: 'NSLP Training Video Series',
            description: 'Complete video training series for new staff',
            url: 'https://theicn.org/resources/nslp-training-videos',
            type: 'video'
          },
          {
            title: 'Staff Training PowerPoint',
            description: 'Customizable presentation for staff training',
            url: 'https://theicn.org/resources/staff-training-presentation',
            type: 'ppt',
            size: '5.2 MB'
          }
        ]
      }
    ],
    sourceUrl: 'https://theicn.org/school-nutrition-programs/#nslp'
  },
  sbp: {
    title: 'School Breakfast Program',
    description: 'Essential information about implementing and managing the School Breakfast Program effectively.',
    sections: [
      {
        title: 'Program Basics',
        content: [
          'The School Breakfast Program (SBP) provides reimbursement to states to operate nonprofit breakfast programs in schools and residential childcare institutions.',
          'Like the National School Lunch Program, the School Breakfast Program must operate as a non-profit program.',
          'Schools receive federal reimbursement for each breakfast served.'
        ],
        downloads: [
          {
            title: 'SBP Implementation Guide',
            description: 'Complete guide to starting and managing a breakfast program',
            url: 'https://theicn.org/resources/sbp-implementation-guide',
            type: 'pdf',
            size: '3.4 MB'
          }
        ]
      },
      {
        title: 'Service Models',
        content: [
          'Different service models can be implemented to increase participation and accessibility.'
        ],
        subsections: [
          {
            title: 'Breakfast in the Classroom',
            content: [
              'Meals delivered to and served in the classroom',
              'Higher participation rates',
              'Reduced stigma'
            ],
            downloads: [
              {
                title: 'BIC Implementation Toolkit',
                description: 'Resources for starting a Breakfast in the Classroom program',
                url: 'https://theicn.org/resources/bic-toolkit',
                type: 'pdf',
                size: '1.5 MB'
              }
            ]
          },
          {
            title: 'Grab and Go Breakfast',
            content: [
              'Meals packaged for quick service and convenience',
              'Multiple pickup locations throughout school',
              'Flexible eating locations'
            ],
            downloads: [
              {
                title: 'Grab and Go Planning Worksheet',
                description: 'Planning tool for Grab and Go implementation',
                url: 'https://theicn.org/resources/grab-and-go-planning',
                type: 'xls',
                size: '850 KB'
              }
            ]
          }
        ]
      }
    ],
    sourceUrl: 'https://theicn.org/school-nutrition-programs/#sbp'
  }
};

const LearningResource = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  
  const resource = id ? resourceContents[id] : null;

  if (!resource) {
    return (
      <div className={`p-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Resource not found
      </div>
    );
  }

  const renderDownloads = (downloads?: ResourceDownload[]) => {
    if (!downloads?.length) return null;

    return (
      <div className={`mt-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4`}>
        <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Resources & Downloads
        </h4>
        <div className="space-y-3">
          {downloads.map((download, index) => {
            const Icon = getFileIcon(download.type);
            return (
              <a
                key={index}
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start p-3 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-600/50' 
                    : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <div className="ml-3 flex-1">
                  <div className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {download.title}
                  </div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {download.description}
                  </p>
                  {download.size && (
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {download.size}
                    </span>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/learning')}
          className={`flex items-center space-x-2 ${
            darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Learning</span>
        </button>
        <a
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Source
        </a>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-8`}>
        <h1 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {resource.title}
        </h1>
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {resource.description}
        </p>

        <div className="space-y-8">
          {resource.sections.map((section, index) => (
            <div key={index}>
              <h2 className={`text-xl font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className={`text-base leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
                {renderDownloads(section.downloads)}
                
                {section.subsections?.map((subsection, sIndex) => (
                  <div key={sIndex} className="mt-6">
                    <h3 className={`text-lg font-medium mb-3 ${
                      darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {subsection.title}
                    </h3>
                    <div className="space-y-3">
                      {subsection.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className={`text-base leading-relaxed ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                      {renderDownloads(subsection.downloads)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningResource;