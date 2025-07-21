import { useRouter, useCanGoBack } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from './button';

export function BackButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  if (!canGoBack) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className={`text-grey-400 border-grey-300 pr-4! uppercase ${className}`}
      onClick={() => router.history.back()}
    >
      <ChevronLeft />
      Back
    </Button>
  );
}
