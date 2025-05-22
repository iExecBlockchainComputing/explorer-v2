import { SUPPORTED_CHAINS } from '@/config.ts';
import { switchChain } from '@wagmi/core';
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
  const { chainId, isConnected, setChainId } = useUserStore();
  const handleChainChange = async (value: string) => {
    if (isConnected) {
      switchChain(wagmiAdapter.wagmiConfig, { chainId: Number(value) });
    } else {
      setChainId(Number(value));
    }
  };
  return (
    <Select value={chainId.toString()} onValueChange={handleChainChange}>
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