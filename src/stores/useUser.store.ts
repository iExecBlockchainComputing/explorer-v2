import { SUPPORTED_CHAINS } from '@/config';
import { Address } from '@/types';
import type { Connector } from 'wagmi';
import { create } from 'zustand';

type UserState = {
  connector: Connector | undefined;
  setConnector: (param: Connector | undefined) => void;
  isConnected: boolean;
  setIsConnected: (param: boolean) => void;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
  address: Address | undefined;
  setAddress: (param: Address | undefined) => void;
  chainId: number;
  setChainId: (param: number) => void;
};

const useUserStore = create<UserState>((set) => ({
  connector: undefined,
  setConnector: (connector: Connector | undefined) => set({ connector }),
  isConnected: false,
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  isInitialized: false,
  setInitialized: (isInitialized: boolean) => set({ isInitialized }),
  address: undefined,
  setAddress: (address: Address | undefined) => {
    set({ address: address?.toLowerCase() as Address });
  },
  chainId: SUPPORTED_CHAINS[0].id,
  setChainId: (chainId: number | undefined) => {
    set({ chainId: chainId });
  },
}));

export default useUserStore;
