import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const activeButton = containerRef.current.querySelector(
      `[data-tab-index="${currentTab}"]`
    ) as HTMLElement;
    if (!activeButton) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const left = buttonRect.left - containerRect.left;
    const width = buttonRect.width;

    setIndicatorStyle({ left, width });

    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [currentTab, isInitialized]);

  return (
    <div
      ref={containerRef}
      className="bg-primary-foreground relative flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full p-1"
    >
      <div
        className={cn(
          'bg-background border-border absolute top-1 bottom-1 z-0 rounded-full border transition-all duration-300 ease-out',
          !isInitialized && 'opacity-0'
        )}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {tabLabels.map((label, index) => {
        const isDisabled = disabledTabs.includes(index);
        const reason = disabledReasons[index];

        const button = (
          <Button
            key={label}
            data-tab-index={index}
            variant="link"
            role="radio"
            size={'none'}
            onClick={() => {
              if (!isDisabled) onTabChange(index);
            }}
            className={cn(
              'text-foreground relative z-10 border border-transparent px-8 py-2 transition-colors duration-300 hover:no-underline',
              isDisabled && 'cursor-not-allowed opacity-50',
              currentTab === index && 'text-primary'
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
