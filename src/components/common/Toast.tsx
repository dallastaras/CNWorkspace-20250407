import React from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const darkMode = useStore(state => state.darkMode);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg rounded-lg py-3 px-4 flex items-center space-x-3`}>
      {icons[type]}
      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {message}
      </p>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: darkMode ? 'dark' : '',
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0
        }
      }}
    />
  );
};

export const toast = {
  success: (message: string) => hotToast.custom(<Toast message={message} type="success" />),
  error: (message: string) => hotToast.custom(<Toast message={message} type="error" />),
  warning: (message: string) => hotToast.custom(<Toast message={message} type="warning" />),
  info: (message: string) => hotToast.custom(<Toast message={message} type="info" />)
};