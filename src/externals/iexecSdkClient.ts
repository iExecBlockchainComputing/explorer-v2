import { IExec, IExecConfig, Eip1193Provider } from 'iexec';
import { type Connector } from 'wagmi';

let iExec: IExec | null = null;

// Basic promise queue for pending getIExec() requests
const IEXEC_CLIENT_RESOLVES: Array<Promise<IExec>> = [];

// Clean both SDKs
export function cleanIExecSDKs() {
  iExec = null;
}

export async function initIExecSDKs({ connector }: { connector?: Connector }) {
  if (!connector || !connector.getProvider) {
    cleanIExecSDKs();
    return;
  }

  const provider = (await connector.getProvider()) as Eip1193Provider;
  if (!provider) {
    cleanIExecSDKs();
    return;
  }
  // Initialize
  const config = new IExecConfig({ ethProvider: provider });
  iExec = new IExec(config);

  IEXEC_CLIENT_RESOLVES.forEach((resolve) => {
    return resolve(iExec);
  });
  IEXEC_CLIENT_RESOLVES.length = 0;
}

export function getIExec(): Promise<IExec> {
  if (!iExec) {
    return new Promise((resolve) => {
      IEXEC_CLIENT_RESOLVES.push(resolve);
    });
  }
  return Promise.resolve(iExec);
}
