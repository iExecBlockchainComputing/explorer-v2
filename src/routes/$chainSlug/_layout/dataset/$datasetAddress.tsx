import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { BackButton } from '@/components/ui/BackButton';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbs } from '@/modules/datasets/dataset/DatasetBreadcrumbs';
import { DatasetDealsTable } from '@/modules/datasets/dataset/DatasetDealsTable';
import { buildDatasetDetails } from '@/modules/datasets/dataset/buildDatasetDetails';
import { datasetQuery } from '@/modules/datasets/dataset/datasetQuery';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute(
  '/$chainSlug/_layout/dataset/$datasetAddress'
)({
  component: DatasetsRoute,
});

function useDatasetData(datasetAddress: string, chainId: number) {
  const isValid = isValidAddress(datasetAddress);
  const queryKey = [chainId, 'dataset', datasetAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(datasetQuery, chainId, {
          length: TABLE_LENGTH,
          datasetAddress,
          datasetAddressString: datasetAddress,
        });
        if (!result?.dataset) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.dataset,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
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
    isValid,
    error,
  } = useDatasetData((datasetAddress as string).toLowerCase(), chainId!);

  const datasetDetails = dataset ? buildDatasetDetails({ dataset }) : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid dataset address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Dataset not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-6" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <DatasetIcon size={24} />
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
        <div className="flex items-center gap-2">
          <BackButton />
          <DatasetBreadcrumbs datasetId={datasetAddress} />
        </div>
      </div>

      <div className="space-y-10">
        {hasPastError && !datasetDetails ? (
          <ErrorAlert message="An error occurred during dataset details loading." />
        ) : (
          <DetailsTable details={datasetDetails || {}} zebra={false} />
        )}
        <DatasetDealsTable datasetAddress={datasetAddress} />
      </div>
    </div>
  );
}
