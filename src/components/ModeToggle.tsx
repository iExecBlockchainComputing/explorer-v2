import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/themeProvider';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-full border p-1">
      <Button
        variant={'link'}
        size={'none'}
        className={cn(
          'text-foreground hover:bg-muted border p-1',
          theme === 'dark' ? 'border' : 'border-transparent'
        )}
        onClick={() => setTheme('dark')}
      >
        <Moon />
      </Button>
      <Button
        variant={'link'}
        size={'none'}
        className={cn(
          'text-foreground hover:bg-muted border p-1',
          theme === 'light' ? 'border' : 'border-transparent'
        )}
        onClick={() => setTheme('light')}
      >
        <Sun />
      </Button>
      <Button
        variant={'link'}
        size={'none'}
        className={cn(
          'text-foreground hover:bg-muted border p-1',
          theme === 'system' ? 'border' : 'border-transparent'
        )}
        onClick={() => setTheme('system')}
      >
        <Monitor />
      </Button>
    </div>
  );
}
