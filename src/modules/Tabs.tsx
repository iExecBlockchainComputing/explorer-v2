import { Button } from '@/components/ui/button';

type TabsProps = {
  currentTab: number;
  onTabChange: (index: number) => void;
  tabLabels: string[];
};

export function Tabs({ currentTab, onTabChange, tabLabels }: TabsProps) {
  return (
    <div className="flex items-center gap-6">
      {tabLabels.map((label, index) => (
        <Button
          key={label}
          variant={
            currentTab === index
              ? 'gradient-outline-active'
              : 'gradient-outline'
          }
          onClick={() => onTabChange(index)}
        >
          {label.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
