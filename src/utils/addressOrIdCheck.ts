export function isValidDealAddress(address: string): boolean {
  return (
    typeof address === 'string' &&
    address.length === 66 &&
    address.startsWith('0x')
  );
}

export function isValidAddress(address: string): boolean {
  // Ethereum address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}

export function isValidDatasetAddress(address: string): boolean {
  // Dataset address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}

export function isValidTaskAddress(address: string): boolean {
  // Task address: 66 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 66 &&
    address.startsWith('0x')
  );
}

export function isValidTransactionAddress(address: string): boolean {
  // Transaction hash: 66 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 66 &&
    address.startsWith('0x')
  );
}

export function isValidWorkerpoolAddress(address: string): boolean {
  // Workerpool address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}

export function isValidAppAddress(address: string): boolean {
  // App address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}
