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

//TODO: merge both function by adding a new param
export function getSubgraphUrl(chainId: number) {
  const subgraphUrl = getSupportedChains().find(
    (chain) => chain.id === chainId
  )?.subgraphUrl;
  if (!subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
  }
  return subgraphUrl;
}

export function getDataprotectorSubgraphUrl(chainId: number) {
  const dataprotectorSubgraphUrl = getSupportedChains().find(
    (chain) => chain.id === chainId
  )?.dataprotectorSubgraphUrl;
  if (!dataprotectorSubgraphUrl) {
    throw new Error(
      `Dataprotector subgraph URL not found for chain ID: ${chainId}`
    );
  }
  return dataprotectorSubgraphUrl;
}

export function getChainFromSlug(slug: string | undefined) {
  return getSupportedChains().find((c) => c.slug === slug);
}

export function getChainFromId(id: number | undefined) {
  return getSupportedChains().find((c) => c.id === id);
}

export function getBlockExplorerUrl(chainId: number) {
  const blockExplorerUrl = getSupportedChains().find(
    (chain) => chain.id === chainId
  )?.blockExplorerUrl;
  if (!blockExplorerUrl) {
    throw new Error(`Block explorer URL not found for chain ID: ${chainId}`);
  }
  return blockExplorerUrl;
}

/**
 * initial chain evaluated once against the current location when the app loads
 */
export const INITIAL_CHAIN =
  getChainFromSlug(new URL(window.location.href).pathname.split('/')[1]) ||
  getSupportedChains()[0];
