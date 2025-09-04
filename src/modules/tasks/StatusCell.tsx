type StatusEnumType =
  | 'INACTIVE'
  | 'ACTIVE'
  | 'REVEALING'
  | 'COMPLETED'
  | 'FAILLED'
  | 'CONTRIBUTED'
  | 'PROVED'
  | 'REJECTED'
  | 'UNSET';

const StatusCell = ({
  statusEnum,
  timeoutTimestamp = 0,
  bare = false,
}: {
  statusEnum: StatusEnumType;
  timeoutTimestamp?: number;
  bare?: boolean;
}) => {
  const timeout = timeoutTimestamp && timeoutTimestamp < Date.now();

  let label = '';
  let colorClass = '';
  let bgClass = '';
  let borderClass = '';

  switch (statusEnum) {
    case 'INACTIVE':
      label = 'INACTIVE';
      colorClass = timeout
        ? 'text-danger-foreground'
        : 'text-warning-foreground';
      bgClass = timeout
        ? 'bg-danger-foreground/10'
        : 'bg-warning-foreground/10';
      borderClass = timeout ? 'border-danger-border' : 'border-warning-border';
      break;
    case 'ACTIVE':
      label = 'STARTED';
      colorClass = timeout
        ? 'text-danger-foreground'
        : 'text-warning-foreground';
      bgClass = timeout
        ? 'bg-danger-foreground/10'
        : 'bg-warning-foreground/10';
      borderClass = timeout ? 'border-danger-border' : 'border-warning-border';
      break;
    case 'REVEALING':
      label = 'REVEALING';
      colorClass = timeout
        ? 'text-danger-foreground'
        : 'text-warning-foreground';
      bgClass = timeout
        ? 'bg-danger-foreground/10'
        : 'bg-warning-foreground/10';
      borderClass = timeout ? 'border-danger-border' : 'border-warning-border';
      break;
    case 'COMPLETED':
      label = 'COMPLETED';
      colorClass = 'text-success-foreground';
      bgClass = 'bg-success-foreground/10';
      borderClass = 'border-success-border';
      break;
    case 'FAILLED':
      label = 'CLAIMED';
      colorClass = 'text-info-foreground';
      bgClass = 'bg-info-foreground/10';
      borderClass = 'border-info-border';
      break;
    case 'CONTRIBUTED':
      label = 'CONTRIBUTED';
      colorClass = 'text-warning-foreground';
      bgClass = 'bg-warning-foreground/10';
      borderClass = 'border-warning-border';
      break;
    case 'PROVED':
      label = 'PROVED';
      colorClass = 'text-success-foreground';
      bgClass = 'bg-success-foreground/10';
      borderClass = 'border-success-border';
      break;
    case 'REJECTED':
      label = 'REJECTED';
      colorClass = 'text-danger-foreground';
      bgClass = 'bg-danger-foreground/10';
      borderClass = 'border-danger-border';
      break;
    default:
      label = 'UNSET';
      colorClass = 'text-orange-50';
      bgClass = 'bg-orange-50/10';
      borderClass = 'border-orange-50';
      break;
  }

  const classes = bare
    ? `${colorClass}`
    : `rounded-full border px-2 py-1 ${colorClass} ${bgClass} ${borderClass}`;

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className={classes}>
        {label} {label === 'STARTED' && timeout ? '(timeout)' : ''}
      </span>
    </span>
  );
};

export default StatusCell;
