import { SUPPORTED_CHAINS } from '@/config';
import { AlertOctagon } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id);

export function UnsupportedChain() {
  const { isConnected, chainId } = useAccount();
  const isChainSupported =
    chainId !== undefined && SUPPORTED_CHAIN_IDS.includes(chainId);

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
