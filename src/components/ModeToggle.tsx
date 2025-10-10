import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { useTheme } from '@/components/themeProvider';
import { Button } from '@/components/ui/button';

type Theme = 'dark' | 'light' | 'system';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const options: Array<{
    value: Theme;
    label: string;
    Icon: React.ComponentType;
  }> = useMemo(
    () => [
      { value: 'system', label: 'System', Icon: Monitor },
      { value: 'light', label: 'Light', Icon: Sun },
      { value: 'dark', label: 'Dark', Icon: Moon },
    ],
    []
  );

  return (
    <div className="flex items-center rounded-full border p-1">
      {options.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <Button
            key={value}
            type="button"
            variant="link"
            size="none"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            className={cn(
              'text-foreground hover:bg-muted p-1',
              selected && 'border'
            )}
            onClick={() => {
              if (theme !== value) setTheme(value as Theme);
            }}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}
