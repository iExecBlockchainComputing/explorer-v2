import { multiaddr } from '@multiformats/multiaddr';
import { Buffer } from 'buffer';

export const multiaddrHexToHuman = (hexString: string): string => {
  if (hexString.substring(0, 2) !== '0x') return hexString;
  let res: string;
  const buffer: Buffer = Buffer.from(hexString.substring(2), 'hex');
  try {
    res = multiaddr(new Uint8Array(buffer)).toString();
  } catch {
    res = buffer.toString();
  }
  return res;
};

export const mrEnclaveHexToHuman = (hexString: string) => {
  if (hexString.substring(0, 2) !== '0x') return hexString;
  const buffer: Buffer = Buffer.from(hexString.substring(2), 'hex');
  return buffer.toString();
};

export const taskResultToObject = (results?: string | null) => {
  let resultObj = { storage: 'none' };
  try {
    if (results && results !== '0x') {
      resultObj = JSON.parse(
        Buffer.from(results.substring(2), 'hex').toString('utf8')
      );
    }
  } catch {
    // nothing to do
  }
  return resultObj;
};

/**
 * Calculates the number of additional pages for pagination.
 * @param hasNextPage Indicates if there is a next page
 * @param hasNextNextPage Indicates if there is a page after the next
 * @returns 0, 1 or 2 depending on available pages
 */
export function getAdditionalPages(
  hasNextPage: boolean,
  hasNextNextPage: boolean
): number {
  return hasNextPage ? (hasNextNextPage ? 2 : 1) : 0;
}
