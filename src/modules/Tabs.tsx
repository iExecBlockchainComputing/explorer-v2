import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TabsProps = {
  currentTab: number;
  onTabChange: (index: number) => void;
  tabLabels: string[];
  disabledTabs?: number[];
  disabledReasons?: Record<number, string>;
};

export function Tabs({
  currentTab,
  onTabChange,
  tabLabels,
  disabledTabs = [],
  disabledReasons = {},
}: TabsProps) {
  return (
    <div className="-mb-2 flex items-center gap-6 overflow-x-auto pb-2">
      {tabLabels.map((label, index) => {
        const isDisabled = disabledTabs.includes(index);
        const reason = disabledReasons[index];

        const button = (
          <Button
            key={label}
            variant={
              currentTab === index
                ? 'gradient-outline-active'
                : 'gradient-outline'
            }
            onClick={() => {
              if (!isDisabled) onTabChange(index);
            }}
            className={clsx(isDisabled && 'cursor-not-allowed opacity-50')}
          >
            {label.toUpperCase()}
          </Button>
        );

        return isDisabled && reason ? (
          <Tooltip key={label}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{reason}</TooltipContent>
          </Tooltip>
        ) : (
          button
        );
      })}
    </div>
  );
}
