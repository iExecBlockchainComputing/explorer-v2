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

export function getChainFromSlug(slug: string | undefined) {
  return SUPPORTED_CHAINS.find((c) => c.slug === slug);
}

export function getChainFromId(id: number | undefined) {
  return SUPPORTED_CHAINS.find((c) => c.id === id);
}

export function getBlockExplorerUrl(chainId: number) {
  const chain = getChainFromId(chainId);
  return chain?.blockExplorerUrl ?? 'https://blockscout.com/';
}

/**
 * initial chain evaluated once against the current location when the app loads
 */
export const INITIAL_CHAIN =
  getChainFromSlug(new URL(window.location.href).pathname.split('/')[1]) ||
  SUPPORTED_CHAINS[0];
