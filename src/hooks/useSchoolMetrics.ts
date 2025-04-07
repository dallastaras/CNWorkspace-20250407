import { useState, useEffect } from 'react';
import { getSchoolDailyMetrics } from '../lib/api';
import { SchoolMetrics } from '../types';

interface UseSchoolMetricsProps {
  districtId: string;
  selectedSchool: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export const useSchoolMetrics = ({
  districtId,
  selectedSchool,
  dateRange
}: UseSchoolMetricsProps) => {
  const [metrics, setMetrics] = useState<SchoolMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!districtId) return;

      try {
        setLoading(true);
        setError(null);

        // Get the metrics data
        const data = await getSchoolDailyMetrics(districtId, dateRange);
        
        // Group metrics by school_id and get the latest entry for each school
        const latestMetricsBySchool = data.reduce((acc, metric) => {
          const existingMetric = acc.get(metric.school_id);
          if (!existingMetric || new Date(metric.date) > new Date(existingMetric.date)) {
            acc.set(metric.school_id, metric);
          }
          return acc;
        }, new Map<string, SchoolMetrics>());

        if (selectedSchool === 'district') {
          // For district view, return latest metrics for all schools
          setMetrics(Array.from(latestMetricsBySchool.values()));
        } else {
          // For single school view, return only that school's metrics
          const schoolMetrics = latestMetricsBySchool.get(selectedSchool);
          setMetrics(schoolMetrics ? [schoolMetrics] : []);
        }
      } catch (err) {
        console.error('Error fetching school metrics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
        setMetrics([]); // Reset metrics on error
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [districtId, selectedSchool, dateRange]);

  return {
    metrics,
    loading,
    error
  };
};