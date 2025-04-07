import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your nutrition program assistant. How can I help you today?',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        content: message,
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'I\'m analyzing your data and will provide insights soon. This is a placeholder response.',
        },
      ]);
    }, 1000);

    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className={`flex h-full flex-col overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}>
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Bot className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />
                    <h2 className={`text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>AI Assistant</h2>
                  </div>
                  <button
                    type="button"
                    className={`rounded-md ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-400 hover:text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.type === 'user'
                            ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} text-white`
                            : darkMode
                              ? 'bg-gray-700 text-gray-100'
                              : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.type === 'assistant' && (
                          <div className="flex items-center mb-1">
                            <Bot className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Assistant</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="p-4 sm:px-6">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;