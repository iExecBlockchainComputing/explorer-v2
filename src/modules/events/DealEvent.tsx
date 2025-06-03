import SmartLinkGroup from '@/components/SmartLinkGroup';

type DealEventProps = {
  type?: string;
  transaction?: {
    txHash?: string;
  };
  dealid?: string;
  workerpool?: { address: string };
};

const DealEvent = ({
  type,
  transaction,
  dealid,
  workerpool,
}: DealEventProps) => {
  return (
    <div className="flex gap-1">
      {type && <>{type} </>}

      {transaction?.txHash && (
        <div className="flex items-center gap-1">
          <SmartLinkGroup
            type="transaction"
            addressOrId={transaction.txHash}
            label={transaction.txHash}
          />
        </div>
      )}

      {dealid && (
        <div className="flex items-center gap-1">
          {'deal '}
          <SmartLinkGroup type="deal" addressOrId={dealid} label={dealid} />
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
    </div>
  );
};

export default DealEvent;
