import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface ParticipationRateCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
}

export const ParticipationRateCard: React.FC<ParticipationRateCardProps> = (props) => {
  const formatValue = (val: number) => `${Math.round(val)}%`;

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
    />
  );
};