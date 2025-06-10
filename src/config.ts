import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import iexecLogo from './assets/iexec-logo.svg';
import { bellecour, arbitrumSepolia } from './utils/wagmiNetworks';

export const PREVIEW_TABLE_LENGTH = 5;
export const TABLE_LENGTH = 16;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const TABLE_REFETCH_INTERVAL = 10_000;
export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#F4942566',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
    wagmiNetwork: bellecour,
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum-sepolia',
    color: '#28A0F080',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl:
      'https://thegraph.arbitrum-testnet.iex.ec/api/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
    wagmiNetwork: arbitrumSepolia,
  },
];
