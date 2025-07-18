import { SUPPORTED_CHAINS, LOCAL_STORAGE_PREFIX } from '@/config';

function isExperimentalEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_experimental`) === 'true'
    );
  } catch {
    return false;
  }
}

export function getSupportedChains() {
  const experimental = isExperimentalEnabled();
  return SUPPORTED_CHAINS.filter(
    (chain) => !chain.isExperimental || experimental
  );
}

export function getSubgraphUrl(chainId: number) {
  const subgraphUrl = getSupportedChains().find(
    (chain) => chain.id === chainId
  )?.subgraphUrl;
  if (!subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
  }
  return subgraphUrl;
}

export function getChainFromSlug(slug: string | undefined) {
  return getSupportedChains().find((c) => c.slug === slug);
}

export function getChainFromId(id: number | undefined) {
  return getSupportedChains().find((c) => c.id === id);
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
  getSupportedChains()[0];
