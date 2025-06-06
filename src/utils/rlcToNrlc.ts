export function rlcToNrlc(rlcValue: number | bigint): bigint {
  return BigInt(rlcValue) * 10n ** 9n;
}
