import arbitrumSepoliaIcon from './assets/chain-icons/arbitrum-sepolia.svg';
import iexecLogo from './assets/iexec-logo.svg';
import { bellecour, arbitrumSepolia, arbitrum } from './utils/wagmiNetworks';

export const LOCAL_STORAGE_PREFIX = 'Explorer';

export const PREVIEW_TABLE_LENGTH = 5;
export const DETAIL_TABLE_LENGTH = 8;
export const TABLE_LENGTH = 16;
export const PREVIEW_TABLE_REFETCH_INTERVAL = 10_000;
export const TABLE_REFETCH_INTERVAL = 10_000;

export const IPFS_GATEWAY_URL = 'https://ipfs.iex.ec';
export const API_COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/';
export const FAUCET_API_URL = import.meta.env.VITE_FAUCET_API_URL;

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#95A4FC',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: {
      poco: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
      dataprotector:
        'https://thegraph.iex.ec/subgraphs/name/bellecour/dataprotector-v2',
    },
    bridge: 'https://bridge-bellecour.iex.ec/',
    bridgeInformation:
      'Move your xRLC in your wallet between bellecour and Ethereum Mainnet with our bridge.',
    wagmiNetwork: bellecour,
    tokenSymbol: 'xRLC',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    slug: 'arbitrum-mainnet',
    color: '#28A0F080',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://arbiscan.io/',
    subgraphUrl: {
      poco: 'https://thegraph.arbitrum.iex.ec/api/subgraphs/id/B1comLe9SANBLrjdnoNTJSubbeC7cY7EoNu6zD82HeKy',
      dataprotector:
        'https://thegraph.arbitrum.iex.ec/api/subgraphs/id/Ep5zs5zVr4tDiVuQJepUu51e5eWYJpka624X4DMBxe3u',
    },
    wagmiNetwork: arbitrum,
    tokenSymbol: 'RLC',
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum-sepolia-testnet',
    color: '#28A0F080',
    icon: arbitrumSepoliaIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl: {
      poco: 'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
      dataprotector:
        'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
    },
    wagmiNetwork: arbitrumSepolia,
    tokenSymbol: 'RLC',
    isExperimental: true,
  },
];

export const datasetSchemaTypeGroups = [
  {
    label: 'Common types',
    items: [
      { value: 'string' },
      { value: 'f64' },
      { value: 'i128' },
      { value: 'bool' },
    ],
  },
  {
    label: 'Popular File Types',
    items: [
      { value: 'application/pdf' },
      { value: 'image/jpeg' },
      { value: 'image/png' },
      { value: 'image/gif' },
      { value: 'video/mp4' },
    ],
  },
  {
    label: 'Other File Types',
    items: [
      { value: 'application/octet-stream' },
      { value: 'application/xml' },
      { value: 'application/zip' },
      { value: 'image/bmp' },
      { value: 'image/webp' },
      { value: 'video/mpeg' },
      { value: 'video/x-msvideo' },
      { value: 'audio/midi' },
      { value: 'audio/mpeg' },
      { value: 'audio/x-wav' },
    ],
  },
  {
    label: 'Legacy Common Types (deprecated)',
    items: [{ value: 'number' }, { value: 'boolean' }],
  },
];
