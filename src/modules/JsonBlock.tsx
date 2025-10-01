import JsonView from '@uiw/react-json-view';
import CopyButton from '@/components/CopyButton';
import { defaultJsonViewStyle } from '@/utils/jsonViewStyles';

type JsonBlockProps = {
  children: string | object;
  className?: string;
  collapsed?: number;
  enableClipboard?: boolean;
  copyText?: string;
};

const JsonBlock = ({
  children,
  className,
  collapsed = 1,
  enableClipboard = true,
  copyText = 'Copy',
}: JsonBlockProps) => {
  let jsonData: object;
  let rawToCopy: string;

  try {
    if (typeof children === 'object') {
      jsonData = children;
      rawToCopy = JSON.stringify(children);
    } else {
      jsonData = JSON.parse(children);
      rawToCopy = children;
    }
  } catch {
    // If parsing fails, display as plain text
    return (
      <div className={`flex min-w-0 items-start gap-1 ${className}`}>
        <code className="min-w-0 overflow-x-auto text-sm whitespace-pre">
          {String(children)}
        </code>
        {enableClipboard && <CopyButton textToCopy={String(children)} />}
      </div>
    );
  }

  return (
    <div className={`flex min-w-0 items-start gap-1 ${className}`}>
      <div className="min-w-0 flex-1 overflow-x-auto">
        <JsonView
          value={jsonData}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          collapsed={collapsed}
          shortenTextAfterLength={128}
          style={defaultJsonViewStyle}
        />
      </div>
      {enableClipboard && (
        <CopyButton buttonText="Copy Json" textToCopy={rawToCopy} />
      )}
    </div>
  );
};

export default JsonBlock;
