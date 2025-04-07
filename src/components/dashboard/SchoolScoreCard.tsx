import React from 'react';
import { useStore } from '../../store/useStore';
import { Award, Bot, Users, School, GraduationCap } from 'lucide-react';
import { SchoolMetrics } from '../../types';

interface SchoolScoreCardProps {
  metrics: SchoolMetrics | undefined;
}

const getPerformanceGrade = (metrics: SchoolMetrics): {
  grade: string;
  score: number;
  color: string;
} => {
  // Calculate a score based on various metrics
  let score = 0;
  
  // Program Access above 50% is good
  if (metrics.program_access_rate >= 50) score += 20;
  
  // Participation rates
  if (metrics.breakfast_participation_rate >= 35) score += 15;
  if (metrics.lunch_participation_rate >= 75) score += 15;
  
  // MPLH above benchmark
  if (metrics.mplh >= 15) score += 20;
  
  // Revenue metrics
  if (metrics.reimbursement_amount > 0) score += 15;
  if (metrics.alc_revenue > 0) score += 5;
  
  // EOD tasks completion
  if (metrics.eod_tasks_completed) score += 10;

  // Convert score to letter grade and color
  if (score >= 95) return { grade: 'A+', score, color: 'text-green-500' };
  if (score >= 90) return { grade: 'A', score, color: 'text-green-500' };
  if (score >= 85) return { grade: 'A-', score, color: 'text-green-500' };
  if (score >= 80) return { grade: 'B+', score, color: 'text-blue-500' };
  if (score >= 75) return { grade: 'B', score, color: 'text-blue-500' };
  if (score >= 70) return { grade: 'B-', score, color: 'text-blue-500' };
  if (score >= 65) return { grade: 'C+', score, color: 'text-yellow-500' };
  if (score >= 60) return { grade: 'C', score, color: 'text-yellow-500' };
  if (score >= 55) return { grade: 'C-', score, color: 'text-yellow-500' };
  return { grade: 'F', score, color: 'text-red-500' };
};

const getSchoolieInsights = (metrics: SchoolMetrics) => {
  const performance = getPerformanceGrade(metrics);
  const insights = {
    strengths: [] as string[],
    improvements: [] as string[],
    suggestions: [] as string[]
  };

  // Analyze program access
  if (metrics.program_access_rate >= 50) {
    insights.strengths.push('strong program access rate');
  } else {
    insights.improvements.push('program access rate');
    insights.suggestions.push('Consider implementing a community outreach program to increase program awareness');
  }

  // Analyze participation rates
  if (metrics.breakfast_participation_rate >= 35) {
    insights.strengths.push('healthy breakfast participation');
  } else {
    insights.improvements.push('breakfast participation');
    insights.suggestions.push('Try introducing grab-and-go breakfast options to boost participation');
  }

  if (metrics.lunch_participation_rate >= 75) {
    insights.strengths.push('excellent lunch participation');
  } else {
    insights.improvements.push('lunch participation');
    insights.suggestions.push('Consider student taste tests to align menu options with preferences');
  }

  // Analyze MPLH
  if (metrics.mplh >= 15) {
    insights.strengths.push('efficient meal production');
  } else {
    insights.improvements.push('meals per labor hour');
    insights.suggestions.push('Review kitchen workflow and consider batch cooking strategies');
  }

  // Generate conversational message
  let message = '';
  
  // Opening based on grade
  if (performance.grade.startsWith('A')) {
    message = `Fantastic work! ${metrics.school_name} is showing excellent performance `;
  } else if (performance.grade.startsWith('B')) {
    message = `Good job! ${metrics.school_name} is performing well `;
  } else if (performance.grade.startsWith('C')) {
    message = `${metrics.school_name} is showing steady progress `;
  } else {
    message = `${metrics.school_name} has opportunities for improvement `;
  }

  // Add strengths
  if (insights.strengths.length > 0) {
    message += `with ${insights.strengths.join(' and ')}. `;
  }

  // Add improvements if any
  if (insights.improvements.length > 0) {
    message += `We can focus on improving ${insights.improvements.join(' and ')} to boost your score. `;
  }

  // Add a random suggestion
  if (insights.suggestions.length > 0) {
    message += `💡 Quick tip: ${insights.suggestions[Math.floor(Math.random() * insights.suggestions.length)]}`;
  }

  return message;
};

export const SchoolScoreCard: React.FC<SchoolScoreCardProps> = ({ metrics }) => {
  const darkMode = useStore((state) => state.darkMode);
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);

  if (!metrics) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 text-center`}>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No metrics available
        </div>
      </div>
    );
  }

  const performance = getPerformanceGrade(metrics);
  const isHighPerformer = performance.grade.startsWith('A');

  return (
    <div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm relative overflow-hidden p-6`}>
        
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics.school_name || 'School'}
              </h2>
              {/*<p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {selectedTimeframe === 'year' ? 'Academic Year Performance' : 'Performance Score'}
              </p>*/}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-4xl font-bold ${performance.color}`}>
                {performance.grade}
              </div>
            </div>
          </div>
  
          {/* School Profile Section */}
          <div className={`mt-2 grid gap-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
            <div className="flex items-start gap-6 p-6">
              <div className={`mt-1 p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getSchoolieInsights(metrics)}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};