import { IExec, IExecConfig, Eip1193Provider } from 'iexec';
import { type Connector } from 'wagmi';
import { getChainFromId } from '@/utils/chain.utils';

let iExec: IExec | null = null;
let readonlyIExec: IExec | null = null;

// Basic promise queue for pending getIExec() requests
const IEXEC_CLIENT_RESOLVES: Array<Promise<IExec>> = [];

// Clean both SDKs
export function cleanIExecSDKs() {
  iExec = null;
  readonlyIExec = null;
}

export async function initIExecSDKs({
  connector,
  chainId,
}: {
  connector?: Connector;
  chainId?: number;
}) {
  let provider = chainId as unknown as Eip1193Provider;
  if (!connector || !connector.getProvider) {
    cleanIExecSDKs();
  } else {
    provider = (await connector.getProvider()) as Eip1193Provider;
  }
  if (!provider) {
    cleanIExecSDKs();
    return;
  }

  // Initialize
  const config = new IExecConfig(
    { ethProvider: provider },
    { allowExperimentalNetworks: true }
  );
  console.log('config', provider);
  iExec = new IExec(config);

  IEXEC_CLIENT_RESOLVES.forEach((resolve) => resolve(iExec!));
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

export function getReadonlyIExec(chainId: number): IExec {
  const chain = getChainFromId(chainId);
  if (!chain) throw new Error(`Unknown chainId ${chainId}`);

  if (!readonlyIExec) {
    readonlyIExec = new IExec(
      { ethProvider: chain.id },
      { allowExperimentalNetworks: true }
    );
  }
  return readonlyIExec;
}
