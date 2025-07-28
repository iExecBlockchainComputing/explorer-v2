export function isValidId(bytes32: string): boolean {
  // Transaction hash or task ID: 32 bytes, 66 chars, starts with 0x, and matches bytes32 format
  return typeof bytes32 === 'string' && /^(0x)([0-9a-f]{2}){32}$/.test(bytes32);
}

export function isValidAddress(address: string): boolean {
  // Dataset address: 42 chars, starts with 0x, and matches Ethereum address format
  return (
    typeof address === 'string' && /^(0x)([0-9a-fA-F]{2}){20}$/.test(address)
  );
}
