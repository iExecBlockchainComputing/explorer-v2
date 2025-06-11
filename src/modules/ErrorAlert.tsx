import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorAlertProps = {
  message?: string;
  className?: string;
};

export function ErrorAlert({
  message = 'An unexpected error occurred.',
  className = '',
}: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className={`mx-auto w-fit text-left ${className}`}
    >
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
