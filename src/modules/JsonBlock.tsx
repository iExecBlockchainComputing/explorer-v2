import CopyButton from '@/components/CopyButton';

type JsonBlockProps = {
  children: string | object;
};

const JsonBlock = ({ children }: JsonBlockProps) => {
  let display: string;
  let rawToCopy: string;

  try {
    if (typeof children === 'object') {
      rawToCopy = JSON.stringify(children);
      display = JSON.stringify(children, null, 2);
    } else {
      rawToCopy = children;
      display = JSON.stringify(JSON.parse(children), null, 2);
    }
  } catch {
    display = String(children);
    rawToCopy = String(children);
  }

  return (
    <div className="flex min-w-0 items-start gap-1">
      <code className="min-w-0 overflow-x-auto text-sm whitespace-pre">
        {display}
      </code>
      <CopyButton textToCopy={rawToCopy} />
    </div>
  );
};

export default JsonBlock;
