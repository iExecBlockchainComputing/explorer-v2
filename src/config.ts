import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import iexecLogo from './assets/iexec-logo.svg';

export const PREVIEW_TABLE_LENGTH = 5;
export const TABLE_LENGTH = 16;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const TABLE_REFETCH_INTERVAL = 10_000;
export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    color: '#F4942566',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    color: '#28A0F080',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl: 'http://localhost:8080/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
  },
];
