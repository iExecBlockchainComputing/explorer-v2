import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/themeProvider';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div>
      <Button onClick={() => setTheme('light')}>
        <Moon />
        Light
      </Button>
      <Button onClick={() => setTheme('dark')}>
        <Sun />
        Dark
      </Button>
      <Button onClick={() => setTheme('system')}>
        <Sun />
        System
      </Button>
    </div>
  );
}
