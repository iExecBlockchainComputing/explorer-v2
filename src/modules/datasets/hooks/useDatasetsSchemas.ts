import { executeDataprotector } from '@/graphql/executeDataprotector';
import { useQuery } from '@tanstack/react-query';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { datasetSchemaQuery, optimizedProtectedDatasQueryString } from '@/modules/datasets/dataset/protectedDataQuery';

export function useDatasetsSchemas(datasetAddresses: string[], chainId: number) {
  const queryKey = [chainId, 'datasetsSchemas', datasetAddresses.sort()];
  
  const { data, isLoading, isError } = useQuery({
    queryKey,
    enabled: !!chainId && datasetAddresses.length > 0,
    queryFn: async () => {
      try {
        // Utilisation directe d'executeDataprotector avec la query optimisée
        // Plus efficace qu'un Promise.all de n requêtes individuelles
        const result = await executeDataprotector(
          optimizedProtectedDatasQueryString, 
          chainId, 
          { datasetIds: datasetAddresses }
        );
        
        // Transform data into a map for easy lookup
        const schemasMap = new Map<string, Array<{ path?: string | null }>>();
        
        if (result?.protectedDatas) {
          result.protectedDatas.forEach((protectedData: any) => {
            if (protectedData.id) {
              schemasMap.set(protectedData.id, protectedData.schema || []);
            }
          });
        }
        
        // Ensure all requested datasets have an entry (empty array if no schema)
        datasetAddresses.forEach(address => {
          if (!schemasMap.has(address)) {
            schemasMap.set(address, []);
          }
        });
        
        return schemasMap;
      } catch (error) {
        console.warn('Failed to fetch schemas with optimized query, falling back to individual queries:', error);
        
        // Fallback: Use individual queries in parallel if the optimized query fails
        const schemaPromises = datasetAddresses.map(async (address) => {
          try {
            const result = await executeDataprotector(datasetSchemaQuery, chainId, {
              datasetAddress: address,
            });
            return { address, schema: result?.protectedData?.schema || [] };
          } catch {
            return { address, schema: [] };
          }
        });
        
        const results = await Promise.allSettled(schemaPromises);
        const schemasMap = new Map();
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            schemasMap.set(datasetAddresses[index], result.value.schema);
          } else {
            schemasMap.set(datasetAddresses[index], []);
          }
        });
        
        return schemasMap;
      }
    },
    placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    // Cache longer since schemas rarely change
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    schemasMap: data || new Map(),
    isLoading,
    isError,
  };
}

export function useDatasetSchema(datasetAddress: string, chainId: number) {
  const queryKey = [chainId, 'datasetSchema', datasetAddress];
  
  const { data, isLoading, isError } = useQuery({
    queryKey,
    enabled: !!chainId && !!datasetAddress,
    queryFn: async () => {
      const result = await executeDataprotector(datasetSchemaQuery, chainId, {
        datasetAddress,
      });
      return result;
    },
    placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
  });

  return {
    schema: data?.protectedData?.schema || [],
    isLoading,
    isError,
  };
}
