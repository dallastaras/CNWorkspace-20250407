import React from 'react';
import { useStore } from '../../store/useStore';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <select
      className={`px-3 py-2 rounded-lg text-sm ${
        darkMode 
          ? 'bg-gray-800 text-gray-300 border-gray-700' 
          : 'bg-white text-gray-900 border-gray-200'
      } border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};