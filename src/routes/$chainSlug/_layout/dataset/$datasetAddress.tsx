import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbs } from '@/modules/datasets/dataset/DatasetBreadcrumbs';
import { DatasetDealsTable } from '@/modules/datasets/dataset/DatasetDealsTable';
import { buildDatasetDetails } from '@/modules/datasets/dataset/buildDatasetDetails';
import { datasetQuery } from '@/modules/datasets/dataset/datasetQuery';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute(
  '/$chainSlug/_layout/dataset/$datasetAddress'
)({
  component: DatasetsRoute,
});

function useDatasetData(datasetAddress: string, chainId: number) {
  const queryKey = [chainId, 'dataset', datasetAddress];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetQuery, chainId, {
          length: TABLE_LENGTH,
          datasetAddress,
          datasetAddressString: datasetAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  return {
    data: data?.dataset,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function DatasetsRoute() {
  const { chainId } = useUserStore();
  const { datasetAddress } = Route.useParams();
  const {
    data: dataset,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useDatasetData(datasetAddress, chainId!);

  const datasetDetails = dataset ? buildDatasetDetails({ dataset }) : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <Box size="20" />
          Dataset details
          {dataset && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <DatasetBreadcrumbs datasetId={datasetAddress} />
      </div>

      <div className="space-y-10">
        {hasPastError && !datasetDetails ? (
          <ErrorAlert message="An error occurred during deal details  loading." />
        ) : (
          <DetailsTable details={datasetDetails} zebra={false} />
        )}
        <DatasetDealsTable datasetAddress={datasetAddress} />
      </div>
    </div>
  );
}
