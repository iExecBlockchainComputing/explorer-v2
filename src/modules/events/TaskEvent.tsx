import SmartLinkGroup from '@/components/SmartLinkGroup';
import Bytes from '../Bytes';

type TaskEventProps = {
  type?: string;
  task?: {
    taskid?: string;
  };
  transaction?: {
    txHash?: string;
  };
  worker?: {
    address?: string;
  };
  workerpool?: {
    address?: string;
  };
  hash?: string;
  digest?: string;
  consensus?: string;
};

const TaskEvent = ({
  type,
  task,
  transaction,
  worker,
  workerpool,
  hash,
  digest,
  consensus,
}: TaskEventProps) => {
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

      {task?.taskid && (
        <div className="flex items-center gap-1">
          {'task '}
          <SmartLinkGroup
            type="task"
            addressOrId={task.taskid}
            label={task.taskid}
          />
        </div>
      )}

      {workerpool?.address && (
        <div className="flex items-center gap-1">
          {'workerpool '}
          <SmartLinkGroup
            type="workerpool"
            addressOrId={workerpool.address}
            label={workerpool.address}
          />
        </div>
      )}

      {worker?.address && (
        <div className="flex items-center gap-1">
          {'worker '}
          <SmartLinkGroup
            type="address"
            addressOrId={worker.address}
            label={worker.address}
          />
        </div>
      )}

      {hash && (
        <div className="flex items-center gap-1">
          {'contribution hash '}
          <Bytes>{hash}</Bytes>
        </div>
      )}

      {consensus && (
        <div className="flex items-center gap-1">
          {'consensus '}
          <Bytes>{consensus}</Bytes>
        </div>
      )}

      {digest && (
        <div className="flex items-center gap-1">
          {'result digest '}
          <Bytes>{digest}</Bytes>
        </div>
      )}
    </div>
  );
};

export default TaskEvent;
