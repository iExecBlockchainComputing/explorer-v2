import { Copy } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CopyButton = ({
  textToCopy,
  displayText,
  tooltipWithText = false,
}: {
  textToCopy: string;
  displayText?: string;
  tooltipWithText?: boolean;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setTooltipMessage('Copied!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    });
  };

  const handleMouseEnter = () => {
    if (tooltipWithText && displayText) {
      setTooltipMessage(`Copy "${displayText}"`);
    } else {
      setTooltipMessage('Copy');
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <span className="box-content flex max-w-full items-center gap-1">
            {displayText && (
              <span className="overflow-hidden overflow-ellipsis">
                {displayText}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCopy();
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="hover:before:bg-grey-700 active:before:bg-grey-600 relative z-0 -mx-1 -my-1 items-center gap-1 px-1 py-1 transition-colors before:absolute before:inset-0 before:-z-10 before:rounded-lg before:duration-150 active:before:scale-x-[0.98] active:before:scale-y-[0.94]"
            >
              <Copy className="size-4 flex-none" />
            </button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          {tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
