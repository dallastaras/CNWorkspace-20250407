import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface SupperParticipationCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  onClick?: () => void;
}

export const SupperParticipationCard: React.FC<SupperParticipationCardProps> = (props) => {
  const formatValue = (val: number) => `${Math.round(val)}%`;

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
    />
  );
};