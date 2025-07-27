import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { BackButton } from '@/components/ui/BackButton';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbsList } from '@/modules/datasets/DatasetBreadcrumbs';
import {
  SchemaSearch,
  type SchemaFilter,
} from '@/modules/datasets/SchemaSearch';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { useDatasetsSchemas } from '@/modules/datasets/hooks/useDatasetsSchemas';
import { useSchemaSearchData } from '@/modules/datasets/hooks/useSchemaSearchPagination';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';

export const Route = createFileRoute('/$chainSlug/_layout/datasets')({
  component: DatasetsRoute,
});

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

  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.datasetsHasNext?.length),
    Boolean(data?.datasetsHasNextNext?.length)
  );

  // Get schema data for each dataset using optimized hook
  const datasetAddresses = datasets.map((dataset) => dataset.address);
  const { schemasMap, isLoading: isSchemasLoading } = useDatasetsSchemas(
    datasetAddresses,
    chainId!
  );

  const formattedDatasets =
    datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
      schemaPaths: schemasMap.get(dataset.address) || [],
      isSchemaLoading: isSchemasLoading,
    })) ?? [];

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
  const [schemaFilters, setSchemaFilters] = useState<SchemaFilter[]>([]);
  const [schemaSearchCurrentPage, setSchemaSearchCurrentPage] = useState(1);

  // Hook pour les données normales
  const {
    data: normalData,
    isLoading: normalIsLoading,
    isRefetching: normalIsRefetching,
    isError: normalIsError,
    hasPastError: normalHasPastError,
    additionalPages: normalAdditionalPages,
  } = useDatasetsData(currentPage - 1);

  // Hook pour les données de recherche par schéma
  const {
    data: schemaData,
    isLoading: schemaIsLoading,
    isRefetching: schemaIsRefetching,
    isError: schemaIsError,
    hasPastError: schemaHasPastError,
    additionalPages: schemaAdditionalPages,
  } = useSchemaSearchData({
    currentPage: schemaSearchCurrentPage - 1,
    filters: schemaFilters,
  });

  const isUsingSchemaSearch = schemaFilters.length > 0;

  // Données à afficher : soit les résultats du schema search, soit les données normales
  // Pour schema search, utiliser directement les données transformées du hook (pas de transformProtectedDataToDataset)
  const displayData = isUsingSchemaSearch
    ? schemaData // Déjà transformées dans le hook useSchemaSearchData
    : normalData;

  const isLoading = isUsingSchemaSearch ? schemaIsLoading : normalIsLoading;
  const isRefetching = isUsingSchemaSearch
    ? schemaIsRefetching
    : normalIsRefetching;
  const isError = isUsingSchemaSearch ? schemaIsError : normalIsError;
  const hasPastError = isUsingSchemaSearch
    ? schemaHasPastError
    : normalHasPastError;

  // Gérer les changements de filtres
  const handleFiltersChanged = useCallback(
    (filters: SchemaFilter[]) => {
      setSchemaFilters(filters);
      setSchemaSearchCurrentPage(1); // Reset à la page 1 quand les filtres changent
      setCurrentPage(1); // Reset aussi la page normale
    },
    [setCurrentPage]
  );

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      {/* Advanced Schema Search */}
      <SchemaSearch
        className="mx-auto max-w-4xl"
        onFiltersChanged={handleFiltersChanged}
        filters={schemaFilters}
      />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <DatasetIcon size={24} />
          {isUsingSchemaSearch ? 'Filtered Datasets' : 'Datasets'}
          {displayData.length > 0 && isError && (
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

      {hasPastError && !displayData.length ? (
        <ErrorAlert message="An error occurred during datasets loading." />
      ) : (
        <DataTable
          columns={columns}
          data={displayData}
          tableLength={TABLE_LENGTH}
          isLoading={isLoading || isRefetching}
        />
      )}

      {/* Pagination conditionnelle */}
      {isUsingSchemaSearch ? (
        // Pagination pour les résultats de recherche (même pattern que datasets normaux)
        <PaginatedNavigation
          currentPage={schemaSearchCurrentPage}
          totalPages={schemaSearchCurrentPage + schemaAdditionalPages}
          onPageChange={setSchemaSearchCurrentPage}
        />
      ) : (
        // Pagination normale
        <PaginatedNavigation
          currentPage={currentPage}
          totalPages={currentPage + normalAdditionalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
