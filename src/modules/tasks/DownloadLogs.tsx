import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';

export function DownloadLogs({
  taskid,
  className,
}: {
  taskid: string;
  className?: string;
}) {
  const {
    mutate: downloadLogs,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ['downloadLogs', taskid],
    mutationFn: async () => {
      if (!taskid) {
        throw new Error('Task ID is required');
      }

      const iexec = await getIExec();
      const logs = await iexec.task.fetchLogs(taskid);

      if (!logs || logs.length === 0) {
        throw new Error('No logs available for this task');
      }

      const timestamp = new Date().toISOString();
      const header = `Task Logs for ${taskid}\nGenerated on: ${timestamp}\nTotal workers: ${logs.length}\n\n${'='.repeat(80)}\n`;

      const logsString =
        header +
        logs
          .map(({ worker, stdout, stderr }) => {
            let workerLog = `\n----- worker ${worker} -----\n\n`;

            if (stdout && stdout.trim()) {
              workerLog += `stdout:\n${stdout.trim()}\n\n`;
            } else {
              workerLog += `stdout: (empty)\n\n`;
            }

            if (stderr && stderr.trim()) {
              workerLog += `stderr:\n${stderr.trim()}\n\n`;
            } else {
              workerLog += `stderr: (empty)\n\n`;
            }

            return workerLog;
          })
          .join('\n' + '='.repeat(80) + '\n');

      const blob = new Blob([logsString], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `task-${taskid}-logs.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return logs;
    },
    onError: (error) => {
      console.error('Failed to download logs:', error);
    },
  });

  if (!taskid) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => downloadLogs()}
        variant="outline"
        size="sm"
        className={cn(className)}
        disabled={isPending}
      >
        {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Downloading...' : 'Download logs'}
      </Button>
      {isError && (
        <p className="text-sm text-red-500">
          Failed to download logs, please retry later
        </p>
      )}
    </div>
  );
}
