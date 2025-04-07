import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getDeploymentStatus } from '../lib/api';
import { Target, Info, Bot, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { KPI } from '../types';
import { SlideOutPanel } from '../common/SlideOutPanel';
// ... rest of imports

export const KPIDetailsPanel: React.FC<KPIDetailsPanelProps> = ({
  // ... existing props
}) => {
  const [deployError, setDeployError] = useState<Error | null>(null);
  
  // Add error handling for deployment status
  useEffect(() => {
    const checkDeployStatus = async () => {
      try {
        const status = await getDeploymentStatus();
        // Handle status response
      } catch (err) {
        // Ignore 404 errors for deploy status checks
        if (!(err instanceof Error) || !err.message.includes('404')) {
          setDeployError(err instanceof Error ? err : new Error('Failed to check deployment status'));
        }
      }
    };

    // Only check status if needed
    if (/* add your deployment check condition here */) {
      checkDeployStatus();
    }
  }, [/* add dependencies */]);

  // ... rest of component code
};