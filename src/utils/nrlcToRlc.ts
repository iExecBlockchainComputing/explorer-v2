export function nrlcToRlc(nrlcValue: number | null | undefined) {
  if (nrlcValue == null) {
    return '';
  }
  return nrlcValue / 10 ** 9;
}
