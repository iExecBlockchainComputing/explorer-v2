import SmartLinkGroup from '@/components/SmartLinkGroup';

type TransferEventProps = {
  amount?: string | number;
  app?: { address: string };
  dataset?: { address: string };
  workerpool?: { address: string };
  from: { address: string };
  to: { address: string };
  transaction?: {
    txHash?: string;
  };
};

const TransferEvent = ({
  amount,
  app,
  dataset,
  workerpool,
  from,
  to,
  transaction,
}: TransferEventProps) => {
  return (
    <>
      Transfer
      {transaction?.txHash && (
        <div className="flex items-center gap-1">
          <SmartLinkGroup
            type="transaction"
            addressOrId={transaction.txHash}
            label={transaction.txHash}
          />
        </div>
      )}
      {amount && <div className="flex items-center gap-1">{amount}</div>}
      {app && (
        <div className="flex items-center gap-1">
          {'app '}
          <SmartLinkGroup
            type="app"
            addressOrId={app.address}
            label={app.address}
          />
        </div>
      )}
      {dataset && (
        <div className="flex items-center gap-1">
          {'dataset '}
          <SmartLinkGroup
            type="dataset"
            addressOrId={dataset.address}
            label={dataset.address}
          />
        </div>
      )}
      {workerpool && (
        <div className="flex items-center gap-1">
          {'workerpool '}
          <SmartLinkGroup
            type="workerpool"
            addressOrId={workerpool.address}
            label={workerpool.address}
          />
        </div>
      )}
      <div className="flex items-center gap-1">
        {'from '}
        <SmartLinkGroup
          type="address"
          addressOrId={from.address}
          label={from.address}
        />
      </div>
      <div className="flex items-center gap-1">
        {'to '}
        <SmartLinkGroup
          type="address"
          addressOrId={to.address}
          label={to.address}
        />
      </div>
    </>
  );
};

export default TransferEvent;
