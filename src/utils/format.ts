import { multiaddr } from 'multiaddr';

export const multiaddrHexToHuman = (hexString: string): string => {
  if (hexString.substr(0, 2) !== '0x') return hexString;
  let res: string;
  const buffer: Buffer = Buffer.from(hexString.substr(2), 'hex');
  try {
    res = multiaddr(new Uint8Array(buffer)).toString();
  } catch (error) {
    res = buffer.toString();
  }
  return res;
};
