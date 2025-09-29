import { cn } from '@/lib/utils';
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
    <div className="bg-muted -mb-4 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full p-1">
      {tabLabels.map((label, index) => {
        const isDisabled = disabledTabs.includes(index);
        const reason = disabledReasons[index];

        const button = (
          <Button
            key={label}
            variant="link"
            size={'none'}
            onClick={() => {
              if (!isDisabled) onTabChange(index);
            }}
            className={cn(
              'text-foreground border border-transparent px-8 py-2 hover:no-underline',
              isDisabled && 'cursor-not-allowed opacity-50',
              currentTab === index && 'bg-background text-primary border-border'
            )}
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
