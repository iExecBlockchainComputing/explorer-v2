import { cn } from '@/lib/utils.ts';
import { Address } from '@/types.ts';
import { clsx } from 'clsx';
import { useState } from 'react';
import { getAvatarVisualNumber } from '@/utils/getAvatarVisualNumber.ts';
import { truncateAddress } from '@/utils/truncateAddress.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.tsx';
import avatarStyles from './profile.module.css';

export function AddressChip({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) {
  const avatarVisualBg = getAvatarVisualNumber({
    address,
  });

  const displayAddress = truncateAddress(address);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setTooltipMessage('Copied!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    });
  };

  const handleMouseEnter = () => {
    setTooltipMessage('Copy');
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'before:bg-grey-700 hover:before:bg-grey-600 active:before:bg-grey-700 relative z-0 -mx-3 -my-2 flex w-fit items-center gap-1 px-3 py-2 transition-colors before:absolute before:inset-0 before:-z-10 before:rounded-full before:duration-150 active:before:scale-x-[0.98] active:before:scale-y-[0.94]',
              className
            )}
          >
            <span className="text-primary text-sm font-medium">
              {displayAddress}
            </span>
            <div
              className={clsx(
                avatarStyles[avatarVisualBg],
                'relative z-10 size-4 rounded-full bg-black bg-cover'
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          {tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
