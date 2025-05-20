import { SUPPORTED_CHAINS } from '@/config';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';

export function useSyncAccountWithUserStore() {
  const { connector, status, address, chain, isConnected } = useAccount();
  const {
    setConnector,
    setIsConnected,
    setAddress,
    setChainId,
    setSubgraphUrl,
  } = useUserStore();

  useEffect(() => {
    // Update userStore
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);
    setChainId(chain?.id);
    const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chain?.id);
    if (currentChain) {
      setSubgraphUrl(currentChain?.subgraphUrl);
    }
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
    setSubgraphUrl,
  ]);
}
