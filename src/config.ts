import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import iexecLogo from './assets/iexec-logo.svg';
import { bellecour, arbitrumSepolia } from './utils/wagmiNetworks';

export const PREVIEW_TABLE_LENGTH = 5;
export const DETAIL_TABLE_LENGTH = 8;
export const TABLE_LENGTH = 16;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const TABLE_REFETCH_INTERVAL = 10_000;

export const IPFS_GATEWAY_URL = 'https://ipfs.iex.ec';

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#F4942566',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
    bridge: 'https://bridge-bellecour.iex.ec/',
    bridgeInformation:
      'Move your xRLC/RLC in your wallet between iExec Sidechain and Ethereum Mainnet with our bridge.',
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
      'http://localhost:8080/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
    wagmiNetwork: arbitrumSepolia,
  },
];
