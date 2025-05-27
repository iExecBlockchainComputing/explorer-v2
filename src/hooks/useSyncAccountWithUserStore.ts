import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { cleanIExecSDKs, initIExecSDKs } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';

export function useSyncAccountWithUserStore() {
  const { connector, address, isConnected, status } = useAccount();
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

  if (status === 'connected') {
    initIExecSDKs({ connector });
    return;
  }
  cleanIExecSDKs();
}
