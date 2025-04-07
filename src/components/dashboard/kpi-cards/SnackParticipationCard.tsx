import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface SnackParticipationCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  onClick?: () => void;
}

export const SnackParticipationCard: React.FC<SnackParticipationCardProps> = (props) => {
  const formatValue = (val: number) => `${Math.round(val)}%`;

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
    />
  );
};