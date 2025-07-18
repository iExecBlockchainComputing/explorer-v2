import { AlertOctagon } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getSupportedChains } from '@/utils/chain.utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function UnsupportedChain() {
  const { isConnected, chainId } = useAccount();
  const supportedChainIds = getSupportedChains().map((chain) => chain.id);
  const isChainSupported =
    chainId !== undefined && supportedChainIds.includes(chainId);

  if (!isConnected || isChainSupported) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mx-auto mt-8 text-left">
      <AlertOctagon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        It seems that you are using a chain that is not supported.
      </AlertDescription>
    </Alert>
  );
}
