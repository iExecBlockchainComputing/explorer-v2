import {
  PlaceholderDataFunction,
  QueryKey,
  hashKey,
} from '@tanstack/react-query';

/**
 * creates a PlaceholderDataFunction that keeps previous data only if the previous query key match the provided query key
 *
 * usage:
 *
 * ```ts
 * import { useQuery } from '@tanstack/react-query';
 *
 * const query = useQuery(
 *   {
 *     queryKey,
 *     queryFn,
 *     placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
 *   }
 * );
 * ```
 */
export const createPlaceholderDataFnForQueryKey =
  <TQueryFnData, TQueryData, TError>(
    queryKey: QueryKey
  ): PlaceholderDataFunction<TQueryFnData, TError, TQueryData, QueryKey> =>
  (previousData, previousQuery) => {
    if (
      hashKey(queryKey) === previousQuery?.queryHash &&
      previousData !== undefined
    ) {
      return previousData;
    }
  };
