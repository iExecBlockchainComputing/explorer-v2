import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute as executeDp } from '@/graphql/dataprotector/execute';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { useSchemaSearch } from '@/hooks/useSchemaSearch';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { DatasetAccessTable } from '@/modules/datasets/dataset/DatasetAccessTable';
import { DatasetBreadcrumbs } from '@/modules/datasets/dataset/DatasetBreadcrumbs';
import { DatasetDealsTable } from '@/modules/datasets/dataset/DatasetDealsTable';
import { buildDatasetDetails } from '@/modules/datasets/dataset/buildDatasetDetails';
import { datasetQuery } from '@/modules/datasets/dataset/datasetQuery';
import { datasetSchemaQuery } from '@/modules/datasets/dataset/schema/datasetSchemaDpQuery';
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
  const datasetQueryKey = [chainId, 'dataset', datasetAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey: datasetQueryKey,
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
      placeholderData: createPlaceholderDataFnForQueryKey(datasetQueryKey),
    });

  const schemaQueryKey = [chainId, 'datasetSchema', datasetAddress];
  const {
    data: schemaData,
    isLoading: isSchemaLoading,
    isError: isSchemaError,
    error: schemaError,
  } = useQuery({
    queryKey: schemaQueryKey,
    enabled: !!chainId && !!datasetAddress,
    queryFn: async () => {
      const result = await executeDp(datasetSchemaQuery, chainId!, {
        datasetAddress,
      });
      return result;
    },
    placeholderData: createPlaceholderDataFnForQueryKey(schemaQueryKey),
  });

  return {
    dataset: {
      data: data?.dataset,
      isLoading,
      isRefetching,
      isError,
      error,
      hasPastError: isError || errorUpdateCount > 0,
      isValid,
    },
    schema: {
      data: schemaData?.protectedData?.schema || [],
      isLoading: isSchemaLoading,
      isError: isSchemaError,
      error: schemaError,
    },
  };
}

function DatasetsRoute() {
  const tabLabels = ['DETAILS', 'DEALS', 'ACCESS'];
  const [currentTab, setCurrentTab] = useTabParam('datasetTab', tabLabels, 0);
  const { chainId } = useUserStore();

  const { datasetAddress } = Route.useParams();
  const { navigateToDatasets } = useSchemaSearch();

  const { dataset, schema } = useDatasetData(
    (datasetAddress as string).toLowerCase(),
    chainId!
  );

  const [isLoadingChild, setIsLoadingChild] = useState(false);
  const [isOutdatedChild, setIsOutdatedChild] = useState(false);

  const datasetDetails = dataset.data
    ? buildDatasetDetails({
        dataset: dataset.data,
        schema: schema.data,
        isSchemaLoading: schema.isLoading,
        onSchemaSearch: navigateToDatasets,
      })
    : undefined;

  if (!dataset.isValid) {
    return <ErrorAlert className="my-16" message="Invalid dataset address." />;
  }

  if (dataset.isError && dataset.error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Dataset not found." />;
  }

  const showOutdated = dataset.data && (dataset.isError || isOutdatedChild);
  const showLoading =
    dataset.isLoading || dataset.isRefetching || isLoadingChild;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <DatasetIcon size={24} />
            Dataset details
            {showOutdated && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {showLoading && <LoaderCircle className="animate-spin" />}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <DatasetBreadcrumbs datasetId={datasetAddress} />
          </div>
        </div>
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={tabLabels}
        onTabChange={setCurrentTab}
      />
      {currentTab === 0 &&
        (dataset.hasPastError && !datasetDetails ? (
          <ErrorAlert message="An error occurred during dataset details loading." />
        ) : (
          <DetailsTable details={datasetDetails || {}} zebra={false} />
        ))}
      {currentTab === 1 && (
        <DatasetDealsTable
          datasetAddress={datasetAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
      {currentTab === 2 && (
        <DatasetAccessTable
          datasetAddress={datasetAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
    </div>
  );
}
