import { SUPPORTED_CHAINS } from '@/config';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';

export function useSyncAccountWithUserStore() {
  const { connector, status, address, chain, isConnected } = useAccount();
  const { setConnector, setIsConnected, setAddress, setChainId, chainId } =
    useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Update userStore
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);
    const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chain?.id);
    if (currentChain) {
      queryClient.invalidateQueries({ queryKey: [chainId] });
      setChainId(chain!.id);
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
    queryClient,
    chainId,
  ]);
}
