import { IPFS_GATEWAY_URL } from '@/config';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { taskResultToObject } from '@/utils/format';

async function fetchZipFromIpfs(taskid: string, location: string) {
  const url = `${IPFS_GATEWAY_URL}${location}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/zip',
    },
  });

  if (!res.ok) {
    throw new Error('Download error');
  }

  const blob = await res.blob();
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${taskid}.zip`;
  link.click();

  URL.revokeObjectURL(downloadUrl);
}

export function DownloadResult({
  taskid,
  taskResults,
  className,
}: {
  taskid: string;
  taskResults?: string | null;
  className?: string;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: downloadTaskResult,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const { location } = taskResultToObject(taskResults);

      if (!location) throw new Error('Invalid location');
      await fetchZipFromIpfs(taskid, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskid] });
    },
  });

  if (!taskid || !taskResults) return null;

  return (
    <>
      <Button
        variant="link"
        className={cn('text-white underline', className)}
        onClick={() => downloadTaskResult()}
      >
        Download task result
        {isPending && <LoaderCircle className="ml-2 animate-spin" />}
      </Button>
      {isError && (
        <p className="text-danger-foreground content-center">
          An error occurred please try again
        </p>
      )}
    </>
  );
}
