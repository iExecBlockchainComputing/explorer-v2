import { SUPPORTED_CHAINS } from '@/config';

export function getSubgraphUrl(chainId: number) {
  const subgraphUrl = SUPPORTED_CHAINS.find(
    (chain) => chain.id === chainId
  )?.subgraphUrl;
  if (!subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
  }
  return subgraphUrl;
}
