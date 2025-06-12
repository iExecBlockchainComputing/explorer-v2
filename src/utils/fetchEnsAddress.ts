import { getEnsAddress } from '@wagmi/core';
import { normalize } from 'viem/ens';
import { wagmiAdapter } from './wagmiConfig';

export const fetchEnsAddress = async ({
  name,
  chainId,
}: {
  name: string;
  chainId: number;
}) => {
  const config = wagmiAdapter.wagmiConfig;
  return await getEnsAddress(config, {
    name: normalize(name),
    chainId,
  });
};
