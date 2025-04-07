import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { GripVertical, Bot, Target } from 'lucide-react';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { KPI } from '../../types';

interface KPIConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPI[];
  onKPIVisibilityChange: (kpiId: string, isHidden: boolean) => void;
  onKPIOrderChange: (kpis: KPI[]) => void;
}

export const KPIConfigPanel: React.FC<KPIConfigPanelProps> = ({
  isOpen,
  onClose,
  kpis,
  onKPIVisibilityChange,
  onKPIOrderChange
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const [draggedKPI, setDraggedKPI] = useState<string | null>(null);
  const [orderedKPIs, setOrderedKPIs] = useState<KPI[]>([]);

  useEffect(() => {
    setOrderedKPIs(kpis);
  }, [kpis]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, kpiId: string) => {
    setDraggedKPI(kpiId);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedKPI(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add(darkMode ? 'bg-gray-700' : 'bg-gray-100');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(darkMode ? 'bg-gray-700' : 'bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetKpiId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove(darkMode ? 'bg-gray-700' : 'bg-gray-100');

    if (!draggedKPI || draggedKPI === targetKpiId) return;

    const newKPIs = [...orderedKPIs];
    const draggedIndex = newKPIs.findIndex(k => k.id === draggedKPI);
    const targetIndex = newKPIs.findIndex(k => k.id === targetKpiId);

    const [draggedItem] = newKPIs.splice(draggedIndex, 1);
    newKPIs.splice(targetIndex, 0, draggedItem);

    setOrderedKPIs(newKPIs);
    onKPIOrderChange(newKPIs);
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Configure KPIs"
      icon={<Target className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Customize your dashboard view"
    >
      <div className="px-4 py-6 sm:px-6">
        {/*<div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
                <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>
        </div>*/}

        <div className="space-y-2">
          {orderedKPIs.map((kpi) => (
            <div
              key={kpi.id}
              draggable
              onDragStart={(e) => handleDragStart(e, kpi.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, kpi.id)}
              className={`flex items-center justify-between p-4 rounded-lg cursor-move ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } transition-colors`}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {kpi.name}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {kpi.unit === '%' ? 'Percentage' : kpi.unit === '$' ? 'Currency' : 'Number'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!kpi.is_hidden}
                  onChange={() => onKPIVisibilityChange(kpi.id, !kpi.is_hidden)}
                  className="sr-only peer"
                />
                <div className={`
                  w-11 h-6 rounded-full peer 
                  ${darkMode 
                    ? 'bg-gray-700 peer-checked:bg-indigo-600' 
                    : 'bg-gray-200 peer-checked:bg-indigo-600'
                  }
                  peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-white 
                  after:border-gray-300 
                  after:border 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all
                `} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </SlideOutPanel>
  );
};