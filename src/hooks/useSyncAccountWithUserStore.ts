import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';

export function useSyncAccountWithUserStore() {
  const { connector, address, isConnected } = useAccount();
  const { setConnector, setIsConnected, setAddress } = useUserStore();

  useEffect(() => {
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);
  }, [
    connector,
    address,
    isConnected,
    setConnector,
    setIsConnected,
    setAddress,
  ]);
}
