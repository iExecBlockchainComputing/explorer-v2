import { TransactionQuery } from '@/graphql/graphql';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import AccountEvent from '@/modules/events/AccountEvent';
import DealEvent from '@/modules/events/DealEvent';
import TaskEvent from '@/modules/events/TaskEvent';
import TransferEvent from '@/modules/events/TransferEvent';

export function buildTransactionDetails({
  transaction,
}: {
  transaction: TransactionQuery['transaction'];
}) {
  if (!transaction) {
    return {};
  }
  return {
    ...(transaction.txHash && {
      TxHash: (
        <div className="flex flex-wrap items-center gap-1">
          <SmartLinkGroup
            type="address"
            isCurrentPage={true}
            addressOrId={transaction.txHash}
            label={transaction.txHash}
          />
        </div>
      ),
    }),
    ...(transaction.from && {
      From: (
        <SmartLinkGroup
          type="address"
          addressOrId={transaction.from.address}
          label={transaction.from.address}
        />
      ),
    }),
    ...(transaction.to && {
      To: (
        <SmartLinkGroup
          type="address"
          addressOrId={transaction.to.address}
          label={transaction.to.address}
        />
      ),
    }),
    ...(transaction.gasUsed && { 'Gas used': <p>{transaction.gasUsed}</p> }),
    ...(transaction.gasPrice && { 'Gas price': <p>{transaction.gasPrice}</p> }),
    ...(transaction.events && {
      Events: (
        <div className="flex flex-col gap-1">
          {transaction.events.map((event, i) => {
            if (event?.type?.endsWith('Transfer')) {
              return <TransferEvent {...event} key={i} />;
            } else if (event?.type?.indexOf('Task') === 0) {
              return <TaskEvent {...event} key={i} />;
            } else if (
              event?.type === 'OrdersMatched' ||
              event?.type === 'SchedulerNotice'
            ) {
              return <DealEvent {...event} key={i} />;
            } else if (
              event?.type === 'Lock' ||
              event?.type === 'Unlock' ||
              event?.type === 'Seize' ||
              event?.type === 'Reward'
            ) {
              return <AccountEvent {...event} key={i} />;
            } else {
              return <div key={i}>{event.type}</div>;
            }
          })}
        </div>
      ),
    }),
  };
}
