import Big from 'big.js';

export const rlcToNrlc = (rlc: string | number): string => {
  const rlcBig = new Big(rlc);
  const nrlc = rlcBig.times(1e9);
  return nrlc.toFixed(0);
};
