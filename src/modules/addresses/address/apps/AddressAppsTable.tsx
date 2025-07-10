import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/apps/appsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { addressAppsQuery } from './addressAppsQuery';

function useAddressAppsData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * PREVIEW_TABLE_LENGTH;
  const nextSkip = skip + PREVIEW_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * PREVIEW_TABLE_LENGTH;

  const queryKey = [chainId, 'address', 'apps', addressAddress, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(addressAppsQuery, chainId, {
          length: PREVIEW_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const apps = data?.account?.apps ?? [];
  const hasNextPage = (data?.account?.appsHasNext?.length ?? 0) > 0;
  const hasNextNextPage = (data?.account?.appsHasNextNext?.length ?? 0) > 0;
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = hasNextPage ? (hasNextNextPage ? 2 : 1) : 0;

  const formattedDeal =
    apps.map((app) => ({
      ...app,
      destination: `/app/${app.address}`,
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

export function AddressAppsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = usePageParam('addressAppsPage');
  const {
    data: apps,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressAppsData({ addressAddress, currentPage: currentPage - 1 });

  const filteredColumns = columns.filter(
    (col) => col.accessorKey !== 'owner.address'
  );

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests apps
        {!apps && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !apps.length ? (
        <ErrorAlert message="A error occurred during address apps loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={apps}
          tableLength={PREVIEW_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
