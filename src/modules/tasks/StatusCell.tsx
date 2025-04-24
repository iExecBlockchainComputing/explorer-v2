
const StatusCell = ({ statusEnum, timeoutTimestamp = 0 }) => {
  let status, color;
  const timeout = timeoutTimestamp && timeoutTimestamp < Date.now();
  switch (statusEnum) {
    // task satus
    case 'INACTIVE':
      status = 'INACTIVE';
      color = timeout ? '#EF5353' : '#F4C503';
      break;
    case 'ACTIVE':
      status = 'STARTED';
      color = timeout ? '#EF5353' : '#F4C503';
      break;
    case 'REVEALING':
      status = 'REVEALING';
      color = timeout ? '#EF5353' : '#F4C503';
      break;
    case 'COMPLETED':
      status = 'COMPLETED';
      color = '#11B15E';
      break;
    case 'FAILLED':
      status = 'CLAIMED';
      color = '#EF5353';
      break;
    //contribution status
    case 'CONTRIBUTED':
      status = 'CONTRIBUTED';
      color = '#F4C503';
      break;
    case 'PROVED':
      status = 'PROVED';
      color = '#11B15E';
      break;
    case 'REJECTED':
      status = 'REJECTED';
      color = '#EF5353';
      break;
    default:
      status = '';
      color = '#F4C503';
  }

  return (
    <div
      style={{
        color: color,
      }}
    >
      {status}
    </div>
  );
};

export default StatusCell;
