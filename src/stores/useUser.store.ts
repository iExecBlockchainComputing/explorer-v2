import { SUPPORTED_CHAINS } from '@/config';
import { Address } from '@/types';
import { create } from 'zustand';

type UserState = {
  isConnected: boolean;
  setIsConnected: (param: boolean) => void;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
  address: Address | undefined;
  setAddress: (param: Address | undefined) => void;
  chainId: number | undefined;
  setChainId: (param: number) => void;
};

const useUserStore = create<UserState>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  isInitialized: false,
  setInitialized: (isInitialized: boolean) => set({ isInitialized }),
  address: undefined,
  setAddress: (address: Address | undefined) => {
    set({ address: address?.toLowerCase() as Address });
  },
  chainId: undefined,
  setChainId: (chainId: number) => {
    set({ chainId: chainId });
  },
}));

export default useUserStore;
