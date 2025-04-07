import { Shield, CreditCard, Users, Package, Menu as MenuIcon, ClipboardList, Box, BarChart2, Award } from 'lucide-react';

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
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
    timestamp?: string;
  }[];
  resources: {
    title: string;
    description: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
  }[];
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
    score?: number;
  };
  badge?: {
    icon: any;
    name: string;
    description: string;
    criteria: string[];
  };
}

export const modules: Module[] = [
  {
    id: 'accountability-basics',
    title: 'Accountability Fundamentals',
    description: 'Master the essentials of program compliance and accountability in school nutrition operations.',
    duration: '45 minutes',
    videoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop',
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
    sections: [
      {
        title: 'Program Overview',
        content: [
          'Understanding program requirements',
          'Key compliance areas',
          'Documentation standards'
        ],
        timestamp: '0:00'
      },
      {
        title: 'Verification Process',
        content: [
          'Selection methods',
          'Documentation requirements',
          'Follow-up procedures'
        ],
        timestamp: '15:30'
      }
    ],
    resources: [
      {
        title: 'Compliance Checklist',
        description: 'Comprehensive checklist for program compliance',
        type: 'pdf',
        url: '#',
        size: '2.4 MB'
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
        }
      ],
      passingScore: 80
    },
    progress: {
      completed: true,
      lastPosition: 2700,
      quizAttempts: 1,
      quizPassed: true,
      score: 90
    },
    badge: {
      icon: Shield,
      name: 'Compliance Expert',
      description: 'Mastered program compliance fundamentals',
      criteria: [
        'Complete all module sections',
        'Pass the quiz with 80% or higher',
        'Complete practical exercises'
      ]
    }
  },
  {
    id: 'pos-mastery',
    title: 'Point of Sale System Mastery',
    description: 'Learn to efficiently manage transactions and utilize advanced POS features.',
    duration: '60 minutes',
    videoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1280&h=720&fit=crop',
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
        title: 'Basic Operations',
        content: [
          'Starting the day',
          'Processing transactions',
          'End of day procedures'
        ],
        timestamp: '0:00'
      },
      {
        title: 'Advanced Features',
        content: [
          'Special dietary notes',
          'Account management',
          'Report generation'
        ],
        timestamp: '25:00'
      }
    ],
    resources: [
      {
        title: 'POS Quick Reference Guide',
        description: 'Daily operations quick guide',
        type: 'pdf',
        url: '#',
        size: '1.8 MB'
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
    },
    progress: {
      completed: false,
      lastPosition: 1500,
      quizAttempts: 0
    },
    badge: {
      icon: CreditCard,
      name: 'POS Expert',
      description: 'Mastered point of sale operations',
      criteria: [
        'Complete system operations training',
        'Pass the quiz with 85% or higher',
        'Complete hands-on exercises'
      ]
    }
  },
  {
    id: 'menu-planning-essentials',
    title: 'Menu Planning Essentials',
    description: 'Learn to create compliant and appealing menus that meet USDA requirements.',
    duration: '75 minutes',
    videoUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1280&h=720&fit=crop',
    instructor: {
      name: 'Emily Rodriguez',
      title: 'Menu Planning Specialist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    objectives: [
      'Understand meal pattern requirements',
      'Plan cost-effective menus',
      'Incorporate student preferences',
      'Meet nutritional guidelines'
    ],
    sections: [
      {
        title: 'Meal Pattern Requirements',
        content: [
          'Understanding component requirements',
          'Age/grade group specifications',
          'Weekly requirements'
        ],
        timestamp: '0:00'
      },
      {
        title: 'Menu Planning Strategies',
        content: [
          'Cycle menu development',
          'Cost analysis',
          'Student acceptance'
        ],
        timestamp: '30:00'
      }
    ],
    resources: [
      {
        title: 'Menu Planning Worksheet',
        description: 'Interactive menu planning tool',
        type: 'doc',
        url: '#',
        size: '3.2 MB'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the minimum weekly grain requirement for grades 9-12?',
          options: [
            '8 oz eq',
            '10 oz eq',
            '12 oz eq',
            '14 oz eq'
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 85
    },
    progress: {
      completed: true,
      lastPosition: 4500,
      quizAttempts: 2,
      quizPassed: true,
      score: 95
    },
    badge: {
      icon: MenuIcon,
      name: 'Menu Planning Pro',
      description: 'Expert in USDA-compliant menu planning',
      criteria: [
        'Complete all module sections',
        'Pass the quiz with 85% or higher',
        'Create a sample cycle menu'
      ]
    }
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management & Control',
    description: 'Master effective inventory management techniques and cost control strategies.',
    duration: '60 minutes',
    videoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1280&h=720&fit=crop',
    instructor: {
      name: 'David Thompson',
      title: 'Operations Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    },
    objectives: [
      'Implement inventory best practices',
      'Master ordering procedures',
      'Reduce food waste',
      'Control costs effectively'
    ],
    sections: [
      {
        title: 'Inventory Basics',
        content: [
          'Counting procedures',
          'Storage requirements',
          'FIFO principles'
        ],
        timestamp: '0:00'
      },
      {
        title: 'Cost Control',
        content: [
          'Par levels',
          'Order points',
          'Waste tracking'
        ],
        timestamp: '25:00'
      }
    ],
    resources: [
      {
        title: 'Inventory Control Guide',
        description: 'Comprehensive inventory management guide',
        type: 'pdf',
        url: '#',
        size: '2.8 MB'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the recommended frequency for physical inventory counts?',
          options: [
            'Weekly',
            'Bi-weekly',
            'Monthly',
            'Quarterly'
          ],
          correctAnswer: 2
        }
      ],
      passingScore: 80
    },
    progress: {
      completed: false,
      lastPosition: 900,
      quizAttempts: 0
    },
    badge: {
      icon: Box,
      name: 'Inventory Master',
      description: 'Expert in inventory management',
      criteria: [
        'Complete inventory control training',
        'Pass the quiz with 80% or higher',
        'Complete practical exercises'
      ]
    }
  },
  {
    id: 'production-efficiency',
    title: 'Production & Kitchen Efficiency',
    description: 'Learn to optimize kitchen operations and improve production efficiency.',
    duration: '90 minutes',
    videoUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1280&h=720&fit=crop',
    instructor: {
      name: 'Maria Sanchez',
      title: 'Production Manager',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop'
    },
    objectives: [
      'Optimize production schedules',
      'Improve kitchen workflow',
      'Implement batch cooking',
      'Enhance food quality'
    ],
    sections: [
      {
        title: 'Production Planning',
        content: [
          'Forecasting',
          'Production records',
          'Batch cooking'
        ],
        timestamp: '0:00'
      },
      {
        title: 'Quality Control',
        content: [
          'Temperature monitoring',
          'Portion control',
          'Food presentation'
        ],
        timestamp: '45:00'
      }
    ],
    resources: [
      {
        title: 'Production Schedule Template',
        description: 'Customizable production planning tool',
        type: 'doc',
        url: '#',
        size: '1.5 MB'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the recommended batch cooking interval?',
          options: [
            '15 minutes',
            '30 minutes',
            '45 minutes',
            '60 minutes'
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 85
    },
    progress: {
      completed: true,
      lastPosition: 5400,
      quizAttempts: 1,
      quizPassed: true,
      score: 90
    },
    badge: {
      icon: ClipboardList,
      name: 'Production Pro',
      description: 'Master of kitchen production efficiency',
      criteria: [
        'Complete all training modules',
        'Pass the quiz with 85% or higher',
        'Demonstrate practical skills'
      ]
    }
  }
];