import { SUPPORTED_CHAINS } from '@/config.ts';
import { switchChain } from '@wagmi/core';
import { useEffect, useState } from 'react';
import useUserStore from '@/stores/useUser.store.ts';
import { wagmiAdapter } from '@/utils/wagmiConfig.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';

export function ChainSelector() {
  const { chainId } = useUserStore();
  const [selectedChainId, setSelectedChainId] = useState<string>(
    chainId.toString()
  );

  useEffect(() => {
    if (chainId) {
      setSelectedChainId(chainId.toString());
    }
  }, [chainId]);

  const handleChainChange = async (value: string) => {
    setSelectedChainId(value);

    switchChain(wagmiAdapter.wagmiConfig, { chainId: Number(value) });
  };

  return (
    <Select value={selectedChainId} onValueChange={handleChainChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CHAINS.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            <img src={chain.icon} className="size-4" alt="" /> {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
