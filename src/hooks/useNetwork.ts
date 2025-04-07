import { useState, useEffect } from 'react';
import { network } from '../lib/networkUtils';

interface UseNetworkOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

export function useNetwork(options: UseNetworkOptions = {}) {
  const [isOnline, setIsOnline] = useState(network.getStatus().online);

  useEffect(() => {
    const handleStatusChange = (online: boolean) => {
      setIsOnline(online);
      if (online) {
        options.onOnline?.();
      } else {
        options.onOffline?.();
      }
    };

    return network.addListener(handleStatusChange);
  }, [options]);

  return {
    isOnline,
    networkStatus: network.getStatus()
  };
}