import { decodeTag } from 'iexec/utils';
import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';

const Tags = (props: { children: string }) => {
  const { children: raw } = props;

  let tags: string[] | null = null;
  try {
    tags = decodeTag(raw);
  } catch {
    // If decoding fails, fall back to displaying raw encoded tag
  }
  return (
    <div>
      <div className="flex items-center gap-1">
        {tags ? (
          tags.map((t) => (
            <span
              className="inline-flex w-fit rounded-full border px-4 py-2 text-xs uppercase"
              key={t}
            >
              {t}
            </span>
          ))
        ) : (
          <>
            <span className="hidden md:inline">{raw}</span>
            <span className="inline md:hidden">{truncateAddress(raw)}</span>
          </>
        )}{' '}
        <CopyButton textToCopy={raw} />
      </div>
    </div>
  );
};

export default Tags;
