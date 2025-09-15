import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { LOCAL_STORAGE_PREFIX } from '@/config';
import { execute as executeDp } from '@/graphql/dataprotector/execute';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useSearch,
  useNavigate,
} from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { BackButton } from '@/components/ui/BackButton';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbsList } from '@/modules/datasets/DatasetBreadcrumbs';
import { SchemaSearch } from '@/modules/datasets/SchemaSearch';
import { schemaSearchPaginatedQuery } from '@/modules/datasets/dataset/schemaSearchPaginatedDpQuery';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { createColumns } from '@/modules/datasets/datasetsTable/columns';
import { useDatasetsSchemas } from '@/modules/datasets/hooks/useDatasetsSchemas';
import {
  decodeSchemaFilters,
  encodeSchemaFilters,
  SchemaFilter,
} from '@/modules/datasets/schemaFilters';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';

export const Route = createFileRoute('/$chainSlug/_layout/datasets')({
  component: DatasetsRoute,
});

function formatDataset(dataset: any) {
  return {
    address: dataset.address ?? dataset.id ?? '',
    name: dataset.name ?? '',
    schema: dataset.schema ?? [],
    isSchemasLoading: dataset.isSchemasLoading ?? false,
    owner: { address: dataset.owner?.address ?? dataset.owner?.id ?? '' },
    timestamp: dataset.timestamp ?? dataset.creationTimestamp ?? null,
    transfers: dataset.transfers ?? [
      {
        transaction: {
          txHash: dataset.tx_hash ?? dataset.id ?? '',
        },
      },
    ],
    destination: `/dataset/${dataset.address ?? dataset.id ?? ''}`,
    multiaddr: dataset.multiaddr ?? '',
    checksum: dataset.checksum ?? '',
  };
}

function useDatasetsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [chainId, 'datasets', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetsQuery, chainId, {
          length: TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const datasets = data?.datasets ?? [];
  const additionalPages = getAdditionalPages(
    Boolean(data?.datasetsHasNext?.length),
    Boolean(data?.datasetsHasNextNext?.length)
  );

  const datasetAddresses = datasets.map((dataset) => dataset.address);
  const { schemasMap, isLoading: isSchemasLoading } = useDatasetsSchemas(
    datasetAddresses,
    chainId!
  );

  const formattedDatasets = datasets.map((dataset) =>
    formatDataset({
      ...dataset,
      schema: schemasMap.get(dataset.address) || [],
      isSchemasLoading,
    })
  );

  return {
    data: formattedDatasets,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function DatasetsRoute() {
  const [currentPage, setCurrentPage] = usePageParam('datasetsPage');
  const [isSchemaSearchOpen, setIsSchemaSearchOpen] =
    useLocalStorageState<boolean>(
      `${LOCAL_STORAGE_PREFIX}_is_datasets_schema_search_open`,
      { defaultValue: true }
    );
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const filters: SchemaFilter[] = decodeSchemaFilters(search?.schema);
  const { chainId } = useUserStore();

  useEffect(() => {
    if (!isSchemaSearchOpen && filters.length > 0) {
      setIsSchemaSearchOpen(true);
    }
  }, []);

  const handleAddFilter = (filter: SchemaFilter) => {
    const newFilters = [...filters, filter];
    navigate({
      search: { ...search, schema: encodeSchemaFilters(newFilters) },
      replace: true,
      resetScroll: false,
    });
    setCurrentPage(0);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    const newSearch = { ...search };
    if (newFilters.length === 0) {
      delete newSearch.schema;
    } else {
      newSearch.schema = encodeSchemaFilters(newFilters);
    }
    navigate({
      search: newSearch,
      replace: true,
      resetScroll: false,
    });
    setCurrentPage(0);
  };

  const handleClearAllFilters = () => {
    const newSearch = { ...search };
    delete newSearch.schema;
    navigate({
      search: newSearch,
      replace: true,
      resetScroll: false,
    });
    setCurrentPage(0);
  };

  const handleSchemaSearch = (schemaFilters: any) => {
    navigate({
      search: { ...search, schema: encodeSchemaFilters(schemaFilters) },
      replace: false,
      resetScroll: true,
    });
    setCurrentPage(0);

    if (!isSchemaSearchOpen) {
      setIsSchemaSearchOpen(true);
    }
  };

  const useSchemaSearch = filters.length > 0;

  const datasetsData = useDatasetsData(currentPage - 1);

  const skip = (currentPage - 1) * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;
  const requiredSchema = filters.map((f) => `${f.path}:${f.type}`);

  const schemaResult = useQuery({
    queryKey: [
      chainId,
      'protectedDatas',
      'schemaSearch',
      currentPage,
      requiredSchema.join(','),
    ],
    queryFn: async () => {
      const res = await executeDp(schemaSearchPaginatedQuery, chainId, {
        length: TABLE_LENGTH,
        skip,
        nextSkip,
        nextNextSkip,
        requiredSchema,
      });
      return {
        protectedDatas: res.protectedDatas ?? [],
        protectedDatasHasNext: res.protectedDatasHasNext ?? [],
        protectedDatasHasNextNext: res.protectedDatasHasNextNext ?? [],
      };
    },
    refetchInterval: TABLE_REFETCH_INTERVAL,
    enabled: !!chainId && useSchemaSearch,
    placeholderData: {
      protectedDatas: [],
      protectedDatasHasNext: [],
      protectedDatasHasNextNext: [],
    },
  });

  const data = useSchemaSearch
    ? (schemaResult.data?.protectedDatas ?? []).map(formatDataset)
    : datasetsData.data;

  const isLoading = useSchemaSearch
    ? schemaResult.isLoading
    : datasetsData.isLoading;
  const isRefetching = useSchemaSearch
    ? schemaResult.isRefetching
    : datasetsData.isRefetching;
  const isError = useSchemaSearch ? schemaResult.isError : datasetsData.isError;
  const hasPastError = useSchemaSearch
    ? schemaResult.isError || schemaResult.errorUpdateCount > 0
    : datasetsData.hasPastError;
  const additionalPages = useSchemaSearch
    ? getAdditionalPages(
        Boolean(schemaResult.data?.protectedDatasHasNext?.length),
        Boolean(schemaResult.data?.protectedDatasHasNextNext?.length)
      )
    : datasetsData.additionalPages;

  const columns = createColumns(handleSchemaSearch);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-6" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <DatasetIcon size={24} />
          Datasets
          {data.length > 0 && isError && (
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
          <DatasetBreadcrumbsList />
        </div>
      </div>

      <SchemaSearch
        filters={filters}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        isOpen={isSchemaSearchOpen}
        setIsOpen={setIsSchemaSearchOpen}
      />

      {hasPastError && !data.length ? (
        <ErrorAlert message="An error occurred during datasets loading." />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          tableLength={TABLE_LENGTH}
          isLoading={isLoading || isRefetching}
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
