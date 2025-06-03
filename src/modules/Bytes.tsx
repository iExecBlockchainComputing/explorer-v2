import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';

const Bytes = (props: { children: string }) => {
  const { children: raw } = props;
  const chunks = raw?.match(/(.{1,66})/g) || [];
  return (
    <div>
      {chunks.map((chunk, i) => (
        <div className="flex items-center gap-1" key={i}>
          <span className="hidden md:inline">{chunk}</span>
          <span className="inline md:hidden">{truncateAddress(chunk)}</span>
          {i === chunks.length - 1 && <CopyButton textToCopy={raw} />}
        </div>
      ))}
    </div>
  );
};

export default Bytes;
