import React from 'react';
import { useStore } from '../../../store/useStore';
import { Plus, X } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
}

interface CourseQuizProps {
  questions: Question[];
  onQuestionChange: (index: number, updates: Partial<Question>) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
}

export const CourseQuiz: React.FC<CourseQuizProps> = ({
  questions,
  onQuestionChange,
  onAddQuestion,
  onRemoveQuestion
}) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Quiz Questions
      </h2>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="mb-4">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-1`}>
                Question
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => onQuestionChange(index, { question: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div className="space-y-3 mb-4">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Options
              </label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={question.correct_answer === optionIndex}
                    onChange={() => onQuestionChange(index, { correct_answer: optionIndex })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optionIndex] = e.target.value;
                      onQuestionChange(index, { options: newOptions });
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                    className={`flex-1 px-3 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-indigo-500`}
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== optionIndex);
                        onQuestionChange(index, { options: newOptions });
                      }}
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                          : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {question.options.length < 6 && (
                <button
                  onClick={() => {
                    const newOptions = [...question.options, ''];
                    onQuestionChange(index, { options: newOptions });
                  }}
                  className={`flex items-center px-4 py-2 ${
                    darkMode
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } rounded-lg`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </button>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onRemoveQuestion(index)}
                className={`flex items-center px-3 py-1 rounded-md ${
                  darkMode
                    ? 'bg-gray-600 text-red-400 hover:bg-gray-500'
                    : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                Remove Question
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={onAddQuestion}
          className={`flex items-center px-4 py-2 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } rounded-lg`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Question
        </button>
      </div>
    </div>
  );
};