import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface MealsServedCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  onClick?: () => void;
}

export const MealsServedCard: React.FC<MealsServedCardProps> = (props) => {
  const formatValue = (val: number) => {
    // Format as whole number with commas
    return Math.round(val).toLocaleString();
  };

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
    />
  );
};