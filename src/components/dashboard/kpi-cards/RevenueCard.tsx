import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface RevenueCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  onClick?: () => void;
}

export const RevenueCard: React.FC<RevenueCardProps> = (props) => {
  const formatValue = (val: number) => {
    // Format as currency with commas and no cents for large numbers
    return val >= 1000 
      ? `$${Math.round(val).toLocaleString()}`
      : `$${val.toFixed(2)}`;
  };

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
    />
  );
};