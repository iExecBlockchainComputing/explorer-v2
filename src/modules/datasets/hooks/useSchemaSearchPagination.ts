import { TABLE_LENGTH } from '@/config';
import { executeDataprotector } from '@/graphql/executeDataprotector.ts';
import { useQuery } from '@tanstack/react-query';
import { schemaSearchPaginatedQuery } from '@/modules/datasets/dataset/protectedDataQuery';
import { transformProtectedDataToDataset } from '@/modules/datasets/utils/datasetTypeUtils';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';


interface SchemaFilter {
  id: string;
  path: string;
  type: string;
}

interface UseSchemaSearchDataProps {
  currentPage: number;
  filters: SchemaFilter[];
}

// Reusable hook for schema search pagination with server-side filtering
export function useSchemaSearchData({
  currentPage,
  filters,
}: UseSchemaSearchDataProps) {
  const { chainId } = useUserStore();

  // Build the required schema array for schema_contains
  // Format: ["path:type", "path:type", ...]
  const requiredSchema = filters.map(
    (filter) => `${filter.path}:${filter.type}`
  );

  // Normal server pagination: 16 elements per page (no accumulation needed since filtering is server-side)
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [
    chainId,
    'schema-search-paginated',
    currentPage,
    JSON.stringify(filters),
  ];

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        executeDataprotector(schemaSearchPaginatedQuery, chainId!, {
          length: TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          requiredSchema,
        }),
      enabled: !!chainId && filters.length > 0,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const allProtectedDatas = data?.protectedDatas ?? [];

  // No need for client-side filtering since it's done server-side with schema_contains!
  // Direct transformation of DataProtector data to compatible format
  const displayData = allProtectedDatas.map(transformProtectedDataToDataset);

  // Use hasNext/hasNextNext fields directly from DataProtector server
  const hasNextOnServer = Boolean(data?.protectedDatasHasNext?.length);
  const hasNextNextOnServer = Boolean(data?.protectedDatasHasNextNext?.length);

  // Calculate available additional pages
  let additionalPages = 0;
  if (hasNextOnServer) {
    additionalPages = hasNextNextOnServer ? 2 : 1;
  }

  return {
    data: displayData,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}
