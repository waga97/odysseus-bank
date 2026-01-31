/**
 * Odysseus Bank - Network Status Hook
 * Monitors network connectivity and provides offline detection
 */

import { useState, useEffect, useCallback } from 'react';
import type { NetInfoState } from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/**
 * Hook to monitor network connectivity status
 */
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  const handleNetworkChange = useCallback((state: NetInfoState) => {
    setNetworkStatus({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
  }, []);

  useEffect(() => {
    // Get initial state
    void NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [handleNetworkChange]);

  const isOffline =
    !networkStatus.isConnected || networkStatus.isInternetReachable === false;

  return {
    ...networkStatus,
    isOffline,
  };
}

export default useNetworkStatus;
