import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { addressRequestedTasksQuery } from './addressRequestedTasksQuery';
import { nextAddressRequestedTasksQuery } from './nextAddressRequestedTasksQuery';

function useAddressRequestedTasksData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * PREVIEW_TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['address', 'requestedTasks', addressAddress, currentPage],
      queryFn: () =>
        execute(addressRequestedTasksQuery, chainId, {
          length: PREVIEW_TABLE_LENGTH,
          skip,
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'requestedTasks-next', addressAddress, currentPage],
    queryFn: () =>
      execute(nextAddressRequestedTasksQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextRequestedTasks = nextData?.account?.taskRequester ?? [];

  const additionalPages = Math.ceil(
    nextRequestedTasks.length / PREVIEW_TABLE_LENGTH
  );

  console.log('useAddressRequestedTasksData', data);

  const formattedDeal =
    data?.account?.taskRequester.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return {
    data: formattedDeal,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AddressRequestedTasksTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  console.log('AddressRequestedTasksTable rendered', addressAddress);

  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: requestedTasks,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressRequestedTasksData({ addressAddress, currentPage });

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests requested tasks
        {!requestedTasks && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !requestedTasks.length ? (
        <ErrorAlert message="A error occurred during address requestedTasks loading." />
      ) : (
        <DataTable
          columns={columns}
          data={requestedTasks}
          tableLength={PREVIEW_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
