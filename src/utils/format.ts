import { multiaddr } from '@multiformats/multiaddr';

export const multiaddrHexToHuman = (hexString: string): string => {
  if (hexString.substr(0, 2) !== '0x') return hexString;
  let res: string;
  const buffer: Buffer = Buffer.from(hexString.substr(2), 'hex');
  try {
    res = multiaddr(new Uint8Array(buffer)).toString();
  } catch {
    res = buffer.toString();
  }
  return res;
};

export const taskResultToObject = (results) => {
  let resultObj = { storage: 'none' };
  try {
    if (results !== '0x') {
      resultObj = JSON.parse(
        Buffer.from(results.substr(2), 'hex').toString('utf8')
      );
    }
  } catch {
    // nothing to do
  }
  return resultObj;
};
