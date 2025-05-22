import { useParams, useRouter } from '@tanstack/react-router';
import { switchChain } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId, getChainFromSlug } from '@/utils/chain.utils';
import { wagmiAdapter } from '@/utils/wagmiConfig';

export function useSyncChain() {
  const { chainSlug } = useParams({ from: '/$chainSlug' });
  const { pathname } = useRouter().history.location;
  const { navigate } = useRouter();
  const { chain, isConnected } = useAccount();
  const { chainId, setChainId } = useUserStore();

  const isSyncing = useRef(false);

  // Sync store and wallet with the chain from the URL
  useEffect(() => {
    const targetChain = getChainFromSlug(chainSlug);
    if (!targetChain) return;

    if (chainId !== targetChain.id) setChainId(targetChain.id);

    const needsSwitch = isConnected && chain?.id !== targetChain.id;
    if (needsSwitch && !isSyncing.current) {
      isSyncing.current = true;
      switchChain(wagmiAdapter.wagmiConfig, {
        chainId: targetChain.id,
      }).finally(() => {
        isSyncing.current = false;
      });
    }
  }, [chainSlug]);

  // Sync URL if wallet chain changes
  useEffect(() => {
    const walletChain = getChainFromId(chain?.id);
    if (!walletChain) return;

    if (chainId !== walletChain.id) setChainId(walletChain.id);

    if (walletChain.slug !== chainSlug && !isSyncing.current) {
      const [, ...rest] = pathname.split('/').filter(Boolean);
      const newPath = `/${walletChain.slug}/${rest.join('/')}`;
      isSyncing.current = true;
      const navigationResult = navigate({ to: newPath, replace: true });
      if (navigationResult instanceof Promise) {
        navigationResult.finally(() => {
          isSyncing.current = false;
        });
      } else {
        isSyncing.current = false;
      }
    }
  }, [chain?.id]);
}
