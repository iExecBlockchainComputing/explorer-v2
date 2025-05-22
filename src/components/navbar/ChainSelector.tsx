import { SUPPORTED_CHAINS } from '@/config.ts';
import { useRouter } from '@tanstack/react-router';
import useUserStore from '@/stores/useUser.store.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';

export function ChainSelector() {
  const { chainId } = useUserStore();
  const { navigate } = useRouter();

  const handleChainChange = async (value: string) => {
    const newChainSlug = SUPPORTED_CHAINS.find(
      (chain) => chain.id === Number(value)
    )?.slug;
    const pathParts = location.pathname.split('/').filter(Boolean);
    const newPath =
      pathParts.length > 1
        ? `/${newChainSlug}/${pathParts.slice(1).join('/')}`
        : `/${newChainSlug}`;

    navigate({ to: newPath });
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
