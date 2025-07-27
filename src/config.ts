import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import iexecLogo from './assets/iexec-logo.svg';
import { bellecour, arbitrumSepolia } from './utils/wagmiNetworks';

export const LOCAL_STORAGE_PREFIX = 'Explorer';

export const PREVIEW_TABLE_LENGTH = 5;
export const DETAIL_TABLE_LENGTH = 8;
export const TABLE_LENGTH = 16;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const TABLE_REFETCH_INTERVAL = 10_000;

export const IPFS_GATEWAY_URL = 'https://ipfs.iex.ec';
export const API_COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/';

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#F4942566',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
    dataprotectorSubgraphUrl:
      'https://thegraph.iex.ec/subgraphs/name/bellecour/dataprotector-v2',
    bridge: 'https://bridge-bellecour.iex.ec/',
    bridgeInformation:
      'Move your xRLC in your wallet between bellecour and Ethereum Mainnet with our bridge.',
    wagmiNetwork: bellecour,
    tokenSymbol: 'xRLC',
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum-sepolia-testnet',
    color: '#28A0F080',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl:
      'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
    dataprotectorSubgraphUrl:
      'https://gateway.thegraph.com/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
    wagmiNetwork: arbitrumSepolia,
    tokenSymbol: 'RLC',
    isExperimental: true,
  },
];

// Schema filter type constants
export const LEGACY_TYPES = ['boolean', 'number'] as const;

export const SUPPORTED_MIME_TYPES = [
  'application/octet-stream',
  'application/pdf',
  'application/xml',
  'application/zip',
  'audio/midi',
  'audio/mpeg',
  'audio/x-wav',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/mpeg',
  'video/x-msvideo',
] as const;

// Most commonly used types
export const COMMON_DATA_TYPES = ['string', 'bool', 'f64', 'i128'] as const;

// Popular file types
export const POPULAR_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
] as const;
