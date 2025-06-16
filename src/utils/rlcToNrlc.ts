export const rlcToNrlc = (rlc: number | string): string => {
  const rlcNumber = typeof rlc === 'string' ? parseFloat(rlc) : rlc;

  const nrlc = Math.round(rlcNumber * 1e9);
  return nrlc.toString();
};
