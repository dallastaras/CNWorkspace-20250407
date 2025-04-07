import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, XCircle, BarChart2, RefreshCw, Loader2 } from 'lucide-react';
import { saveQuizAttempt, getQuizAttempts } from '../../lib/api';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  passingScore: number;
  courseId: string;
  onTabChange: (tab: string) => void;
  onComplete: (passed: boolean, score: number) => void;
}

interface QuizAttempt {
  date: string;
  score: number;
  passed: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ 
  questions, 
  passingScore, 
  courseId,
  onTabChange, 
  onComplete 
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load previous attempts
  React.useEffect(() => {
    const loadAttempts = async () => {
      try {
        setLoading(true);
        const data = await getQuizAttempts(courseId);
        setAttempts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load attempts');
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
  }, [courseId]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      // Check if the answer matches the correct_answer property
      const isCorrect = answer === questions[index].correct_answer;
      return count + (isCorrect ? 1 : 0);
    }, 0);
    
    // Calculate percentage and round to nearest integer
    const percentage = (correctAnswers / questions.length) * 100;
    return Math.round(percentage);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate final score
      const score = calculateScore();
      
      // Determine if passed based on passing score
      const passed = score >= passingScore;
      
      // Save attempt to Supabase
      await saveQuizAttempt(courseId, score, passed);
      
      // Reload attempts to get the latest
      const updatedAttempts = await getQuizAttempts(courseId);
      setAttempts(updatedAttempts);
      
      setShowResults(true);
      onComplete(passed, score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quiz attempt');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;
    
    if (loading) {
      return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className={`w-8 h-8 animate-spin ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Saving your results...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
        <div className="text-center mb-6">
          {passed ? (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-green-900/20' : 'bg-green-100'
            } mb-4`}>
              <CheckCircle2 className={`w-8 h-8 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
          ) : (
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-red-900/20' : 'bg-red-100'
            } mb-4`}>
              <XCircle className={`w-8 h-8 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
          )}
          <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {passed ? 'Congratulations!' : 'Keep Learning'}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {passed 
              ? 'You have ve successfully completed the quiz!' 
              : 'Unfortunately, you did not quite reach the passing score. Review the material and try again.'}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        } mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your Score
            </span>
            <span className={`text-sm font-medium ${
              passed 
                ? darkMode ? 'text-green-400' : 'text-green-600'
                : darkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              {score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
            <div 
              className={`h-2 rounded-full ${
                passed 
                  ? darkMode ? 'bg-green-500' : 'bg-green-600'
                  : darkMode ? 'bg-red-500' : 'bg-red-600'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-right">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Passing score: {passingScore}%
            </span>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Previous Attempts
            </h4>
            <div className="space-y-2">
              {attempts.map((attempt, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {attempt.passed ? (
                      <CheckCircle2 className={`w-4 h-4 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    ) : (
                      <XCircle className={`w-4 h-4 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                    )}
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> 
                      {new Date(attempt.created_at).toLocaleDateString()} at {new Date(attempt.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    attempt.passed
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {attempt.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {!passed && (
            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
          <button
            onClick={() => onTabChange('overview')}
            className={`px-4 py-2 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-lg`}
          >
            Return to Overview
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasAnswered = answers[currentQuestion] !== undefined;

  // Ensure we have valid questions
  if (!questions?.length || !question) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 text-center`}>
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-600'
        }`}>
          No quiz questions available.
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Module Quiz
          </h3>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
          <div 
            className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {question.question}
        </h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !hasAnswered && handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                showResults
                  ? index === answers[currentQuestion]
                    ? index === question.correct_answer
                      ? darkMode 
                        ? 'bg-green-900/20 text-green-400 border-green-400'
                        : 'bg-green-50 text-green-700 border-green-500'
                      : darkMode
                        ? 'bg-red-900/20 text-red-400 border-red-400'
                        : 'bg-red-50 text-red-700 border-red-500'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-50 text-gray-700'
                  : index === answers[currentQuestion]
                    ? darkMode
                      ? 'bg-indigo-900/20 text-indigo-400 border-indigo-400'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-500'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full ${
                  index === answers[currentQuestion]
                    ? showResults
                      ? index === question.correct_answer
                        ? darkMode 
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-green-100 text-green-700'
                        : darkMode
                          ? 'bg-red-900/20 text-red-400'
                          : 'bg-red-100 text-red-700'
                      : darkMode
                        ? 'bg-indigo-900/20 text-indigo-400'
                        : 'bg-indigo-100 text-indigo-700'
                    : darkMode
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-white text-gray-700'
                } border ${
                  index === answers[currentQuestion]
                    ? showResults
                      ? index === question.correctAnswer
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-indigo-500'
                    : darkMode
                      ? 'border-gray-500'
                      : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                {showResults && index === answers[currentQuestion] && (
                  index === question.correct_answer ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 ml-2" />
                  )
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Passing score: {passingScore}%
          {answers[currentQuestion] !== undefined && (
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`ml-4 px-3 py-1 rounded-md ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              Previous
            </button>
          )}
          {answers[currentQuestion] !== undefined && currentQuestion < questions.length - 1 && (
            <button
              onClick={handleNext}
              className={`ml-2 px-3 py-1 rounded-md ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          )}
        </div>
        {currentQuestion === questions.length - 1 && answers.length === questions.length && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};