import SmartLinkGroup from '@/components/SmartLinkGroup';
import { rlcToNrlc } from '@/utils/rlcToNrlc';

type AccountEventProps = {
  type?: string;
  txHash?: string;
  account?: {
    address: string;
  };
  value?: string | number;
  taskid?: string;
};
const AccountEvent = ({
  type,
  txHash,
  account,
  value,
  taskid,
}: AccountEventProps) => {
  return (
    <div className="flex gap-1">
      {type && <>{type} </>}
      {txHash && (
        <div className="flex items-center gap-1">
          <SmartLinkGroup
            type="transaction"
            addressOrId={txHash}
            label={txHash}
          />
        </div>
      )}

      {value && <p>{rlcToNrlc(Number(value))}</p>}

      {account?.address && (
        <div className="flex items-center gap-1">
          {'on account '}
          <SmartLinkGroup
            type="address"
            addressOrId={account.address}
            label={account.address}
          />
        </div>
      )}
      {taskid && (
        <div className="flex items-center gap-1">
          {'task '}
          <SmartLinkGroup type="task" addressOrId={taskid} label={taskid} />
        </div>
      )}
    </div>
  );
};

export default AccountEvent;
