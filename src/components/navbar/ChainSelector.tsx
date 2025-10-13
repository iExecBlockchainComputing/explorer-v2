import { useChainSwitch } from '@/hooks/useChainSwitch.ts';
import useUserStore from '@/stores/useUser.store.ts';
import { getSupportedChains } from '@/utils/chain.utils.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';

export function ChainSelector({ className }: { className?: string }) {
  const { chainId } = useUserStore();
  const { requestChainChange } = useChainSwitch();

  const chains = getSupportedChains();

  const handleChainChange = async (value: string) => {
    requestChainChange(Number(value));
  };

  return (
    <Select
      value={chainId?.toString()}
      onValueChange={handleChainChange}
      defaultValue="-1"
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent className={className}>
        {chains.map((chain) => (
          <SelectItem
            key={chain.id}
            value={chain.id.toString()}
            className={className}
          >
            <img src={chain.icon} className="size-4" alt="" /> {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
