import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import avalancheFujiIcon from './assets/chain-icons/avalanche-fuji.svg';
import iexecLogo from './assets/iexec-logo.svg';

export const PREVIEW_TABLE_LENGTH = 5;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl: 'http://localhost:8080',
  },
  {
    id: 43113,
    name: 'Avalanche Fuji',
    icon: avalancheFujiIcon,
    blockExplorerUrl: 'https://subnets-test.avax.network/c-chain',
    subgraphUrl: '',
  },
];
