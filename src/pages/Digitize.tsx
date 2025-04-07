import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Bot, Upload, FileText, AlertCircle, Camera, CheckCircle2, FileImage, X, Calendar, User, School, Building, Utensils, List, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadDocument } from '../lib/api';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  preview?: string;
  errorMessage?: string;
  metadata?: {
    formType: string;
    date: string;
    user: string;
    school: string;
    district: string;
    mealType: string;
    menuItems: number;
    processedAt?: string;
    extractionError?: string;
    mealsServed?: number;
    menuItemDetails?: Array<{
      name: string;
      produced: number;
      waste: number;
      carryOver: number;
      returnToStock: number;
    }>;
  };
}

const Digitize = () => {
  const darkMode = useStore((state) => state.darkMode);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const processedFiles = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      status: 'uploading' as const,
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...processedFiles]);

    processedFiles.forEach(file => {
      handleFileUpload(file.id, newFiles.find(f => f.name === file.name)!);
    });
  };

  const handleFileUpload = async (fileId: string, file: File) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = file.progress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...file, progress: 100, status: 'processing' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);

    try {
      await uploadDocument(file);
      
      // Simulate document processing and metadata extraction
      setTimeout(() => {
        // Check if file name contains "unsupported"
        if (file.name.toLowerCase().includes('unsupported')) {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? {
              ...f,
              status: 'error',
              errorMessage: 'This form is not recognized or supported.'
            } : f
          ));
          return;
        }

        // Check if file name contains "unreadable"
        if (file.name.toLowerCase().includes('unreadable')) {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? {
              ...f,
              status: 'complete',
              metadata: {
                formType: 'Production Record',
                date: new Date().toLocaleDateString(),
                user: 'Sarah Johnson',
                school: 'Cybersoft High',
                district: 'Cybersoft ISD',
                mealType: 'Lunch',
                menuItems: 0,
                processedAt: new Date().toLocaleTimeString(),
                extractionError: 'The information on this form is either missing or unable to be extracted.'
              }
            } : f
          ));
          return;
        }

        setFiles(prev => prev.map(f => 
          f.id === fileId ? {
            ...f,
            status: 'complete',
            metadata: {
              formType: 'Production Record',
              date: new Date().toLocaleDateString(),
              user: 'Sarah Johnson',
              school: 'Cybersoft High',
              district: 'Cybersoft ISD',
              mealType: 'Lunch',
              menuItems: 12,
              processedAt: new Date().toLocaleTimeString(),
              mealsServed: 850,
              menuItemDetails: [
                { name: 'Chicken Sandwich', produced: 275, waste: 7, carryOver: 5, returnToStock: 2 },
                { name: 'Cheeseburger', produced: 210, waste: 5, carryOver: 3, returnToStock: 2 },
                { name: 'Spicy Chicken Sandwich', produced: 165, waste: 3, carryOver: 2, returnToStock: 1 },
                { name: 'Garden Burger', produced: 80, waste: 8, carryOver: 5, returnToStock: 3 }
              ]
            }
          } : f
        ));
      }, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error',
          errorMessage: 'Failed to upload file.'
        } : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const renderFilePreview = (file: UploadedFile) => {
    const variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -20 }
    };

    return (
      <motion.div
        key={file.id}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`relative flex flex-col p-4 rounded-lg mb-4 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            {file.type === 'image' && file.preview ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                {file.type === 'image' ? (
                  <FileImage className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <FileText className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {file.name}
            </p>
            <div className="mt-1">
              {file.status === 'uploading' && (
                <>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                      <motion.div
                        className="bg-indigo-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {file.progress}%
                    </span>
                  </div>
                </>
              )}
              {file.status === 'processing' && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-indigo-600 mr-2" />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Processing...
                  </span>
                </div>
              )}
              {file.status === 'complete' && (
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Complete
                  </span>
                </div>
              )}
              {file.status === 'error' && (
                <div className="flex items-center">
                  <X className="w-4 h-4 mr-2 text-red-500" />
                  <span className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {file.errorMessage || 'Error processing file'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => removeFile(file.id)}
            className={`ml-4 p-1 rounded-full ${
              darkMode 
                ? 'hover:bg-gray-600 text-gray-400' 
                : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {file.status === 'complete' && file.metadata ? (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
            <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Document Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.formType}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.date}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.user}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <School className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.school}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.district}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Utensils className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.mealType}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <List className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {file.metadata.menuItems} menu items
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Processed at {file.metadata.processedAt}
                </span>
              </div>
            </div>
            {file.metadata.extractionError && (
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                  <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {file.metadata.extractionError}
                  </p>
                </div>
              </div>
            )}
            {!file.metadata.extractionError && (
              <>
                <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                    <p className={`text-sm flex-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      This form was successfully imported and information was able to be extracted.
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Handle sending to production
                          removeFile(file.id);
                        }}
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Send to Production
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className={`px-3 py-1.5 text-sm ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } rounded-lg`}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <details className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg`}>
                    <summary className={`p-3 cursor-pointer text-sm font-medium ${
                      darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}>
                      Form information details
                    </summary>
                    <div className={`p-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} space-y-4`}>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'} flex items-center justify-between`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Total Meals Served
                        </span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {file.metadata.mealsServed}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Menu Item
                              </th>
                              <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Produced
                              </th>
                              <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Waste
                              </th>
                              <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Carry Over
                              </th>
                              <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Return to Stock
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                            darkMode ? 'divide-gray-700' : 'divide-gray-200'
                          }`}>
                            {file.metadata.menuItemDetails?.map((item, index) => (
                              <tr key={index}>
                                <td className={`px-4 py-3 text-sm font-medium ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.name}
                                </td>
                                <td className={`px-4 py-3 text-sm text-right ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {item.produced}
                                </td>
                                <td className={`px-4 py-3 text-sm text-right ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {item.waste}
                                </td>
                                <td className={`px-4 py-3 text-sm text-right ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {item.carryOver}
                                </td>
                                <td className={`px-4 py-3 text-sm text-right ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {item.returnToStock}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                </div>
              </>
            )}
          </div>
        ) : file.status === 'error' && file.errorMessage && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                {file.errorMessage}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Camera className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <div>
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Digitize
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Capture and process documents
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Card */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              I can help you digitize and process your documents. Simply upload or capture images of your documents, 
              and I'll extract and organize the relevant information for you.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? '#6366f1' : darkMode ? '#374151' : '#e5e7eb'
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-indigo-500' : darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className={`w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Upload or Capture Documents
              </p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Drag and drop files here, or click the buttons below
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className={`flex items-center px-4 py-2 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-lg`}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </button>
            </div>
          </div>
        </motion.div>

        {/* File Previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Uploaded Files
              </h3>
              <div className="space-y-2">
                {files.map(file => renderFilePreview(file))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Digitize;