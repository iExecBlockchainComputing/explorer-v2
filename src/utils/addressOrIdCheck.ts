import { ADDRESS_LENGTH, ID_OR_HASH_LENGTH } from '@/config';

export function isValidId(address: string): boolean {
  // Ethereum address: 66 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === ID_OR_HASH_LENGTH &&
    address.startsWith('0x')
  );
}

export function isValidAddress(address: string): boolean {
  // Dataset address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === ADDRESS_LENGTH &&
    address.startsWith('0x')
  );
}
