import clsx from 'clsx';
import { useState } from 'react';
import { getAvatarVisualNumber } from '@/utils/getAvatarVisualNumber';
import { truncateAddress } from '@/utils/truncateAddress';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import avatarStyles from './profile.module.css';

export function AddressChip({ address }: { address: string }) {
  const avatarVisualBg = getAvatarVisualNumber({
    address,
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('Copy address');

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setTooltipMessage('Address copied!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    });
  };

  const handleMouseEnter = () => {
    setTooltipMessage('Copy address');
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button
            className="bg-grey-800 hover:bg-muted text-primary ml-2"
            variant="secondary"
            onClick={handleCopy}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-sm">{truncateAddress(address)}</span>
            <div
              className={clsx(
                avatarStyles[avatarVisualBg],
                'relative z-10 size-4 rounded-full bg-black bg-cover'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          {tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
