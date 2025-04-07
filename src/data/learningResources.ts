import { Shield, CreditCard, Users, Package, Menu, ClipboardList, Box, BarChart2 } from 'lucide-react';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  objectives: string[];
  prerequisites?: string[];
  sections: {
    title: string;
    content: string[];
    subsections?: {
      title: string;
      content: string[];
      downloads?: ResourceDownload[];
    }[];
    downloads?: ResourceDownload[];
  }[];
  resources: ResourceDownload[];
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
  progress?: {
    completed: boolean;
    lastPosition?: number;
    quizAttempts?: number;
    quizPassed?: boolean;
  };
}

interface ResourceDownload {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'link';
  size?: string;
}

export const learningResources: Record<string, LearningResource> = {
  'accountability-basics': {
    id: 'accountability-basics',
    title: 'Accountability Fundamentals',
    description: 'Master the essentials of program compliance and accountability in school nutrition operations.',
    videoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop',
    duration: '45 minutes',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Program Compliance Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    objectives: [
      'Understand USDA compliance requirements',
      'Master verification procedures',
      'Learn audit preparation best practices',
      'Implement effective record-keeping systems'
    ],
    prerequisites: [
      'Basic understanding of school nutrition programs',
      'Familiarity with USDA guidelines'
    ],
    sections: [
      {
        title: 'Program Compliance Overview',
        content: [
          'Understanding federal requirements',
          'State and local regulations',
          'Program integrity essentials'
        ],
        downloads: [
          {
            title: 'Compliance Checklist',
            description: 'Comprehensive program compliance checklist',
            url: '#',
            type: 'pdf',
            size: '1.2 MB'
          }
        ]
      },
      {
        title: 'Verification Procedures',
        content: [
          'Selection methods and requirements',
          'Documentation standards',
          'Follow-up procedures'
        ],
        subsections: [
          {
            title: 'Selection Methods',
            content: [
              'Random sampling',
              'Focused sampling',
              'Error-prone applications'
            ],
            downloads: [
              {
                title: 'Verification Worksheet',
                description: 'Step-by-step verification process guide',
                url: '#',
                type: 'doc',
                size: '850 KB'
              }
            ]
          },
          {
            title: 'Documentation Requirements',
            content: [
              'Required forms',
              'Income documentation',
              'Assistance program proof'
            ]
          }
        ]
      },
      {
        title: 'Audit Preparation',
        content: [
          'Documentation organization',
          'Common audit focus areas',
          'Response procedures'
        ],
        downloads: [
          {
            title: 'Audit Preparation Guide',
            description: 'Comprehensive audit readiness guide',
            url: '#',
            type: 'pdf',
            size: '2.1 MB'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Program Compliance Guide',
        description: 'Complete guide to program compliance',
        url: '#',
        type: 'pdf',
        size: '4.2 MB'
      },
      {
        title: 'Verification Training',
        description: 'Staff training presentation',
        url: '#',
        type: 'ppt',
        size: '8.5 MB'
      },
      {
        title: 'Record Keeping Webinar',
        description: 'Best practices for documentation',
        url: '#',
        type: 'video'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the required sample size for verification?',
          options: [
            '1%',
            '3%',
            '5%',
            '10%'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'How long must verification records be maintained?',
          options: [
            '1 year',
            '3 years',
            '5 years',
            '7 years'
          ],
          correctAnswer: 2
        }
      ],
      passingScore: 80
    }
  },
  'pos-mastery': {
    id: 'pos-mastery',
    title: 'Point of Sale System Mastery',
    description: 'Learn to efficiently manage transactions and utilize advanced POS features.',
    videoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1280&h=720&fit=crop',
    duration: '60 minutes',
    instructor: {
      name: 'Michael Chen',
      title: 'Technology Integration Specialist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    },
    objectives: [
      'Master daily POS operations',
      'Handle special dietary accommodations',
      'Process various payment types',
      'Generate and analyze reports'
    ],
    sections: [
      {
        title: 'System Basics',
        content: [
          'Login procedures',
          'Interface navigation',
          'Basic transactions'
        ],
        downloads: [
          {
            title: 'POS Quick Start Guide',
            description: 'Basic operations guide',
            url: '#',
            type: 'pdf',
            size: '1.5 MB'
          }
        ]
      },
      {
        title: 'Advanced Features',
        content: [
          'Special dietary notes',
          'Account management',
          'Report generation'
        ],
        subsections: [
          {
            title: 'Dietary Accommodations',
            content: [
              'Allergy alerts',
              'Medical conditions',
              'Special notes'
            ],
            downloads: [
              {
                title: 'Dietary Management Guide',
                description: 'Managing special dietary needs',
                url: '#',
                type: 'pdf',
                size: '2.1 MB'
              }
            ]
          }
        ]
      }
    ],
    resources: [
      {
        title: 'POS Operations Manual',
        description: 'Complete system guide',
        url: '#',
        type: 'pdf',
        size: '5.2 MB'
      },
      {
        title: 'Training Videos',
        description: 'Video tutorials for common tasks',
        url: '#',
        type: 'video'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the correct procedure for processing a refund?',
          options: [
            'Void the transaction',
            'Process a negative payment',
            'Contact supervisor',
            'Issue store credit'
          ],
          correctAnswer: 0
        }
      ],
      passingScore: 85
    }
  }
};