import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';

export function useSyncAccountWithUserStore() {
  const { connector, status, address, chain, isConnected } = useAccount();
  const { setConnector, setIsConnected, setAddress, setChainId } =
    useUserStore();

  useEffect(() => {
    // Update userStore
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);
    setChainId(chain?.id);
  }, [
    connector,
    status,
    address,
    chain,
    isConnected,
    setConnector,
    setIsConnected,
    setAddress,
    setChainId,
  ]);
}
