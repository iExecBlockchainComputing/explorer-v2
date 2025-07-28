export function isValidId(address: string): boolean {
  // Transaction hash or task ID: 66 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 66 &&
    address.startsWith('0x')
  );
}

export function isValidAddress(address: string): boolean {
  // Dataset address: 42 chars, starts with 0x
  return (
    typeof address === 'string' &&
    address.length === 42 &&
    address.startsWith('0x')
  );
}
