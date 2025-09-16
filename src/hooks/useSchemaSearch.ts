import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  encodeSchemaFilters,
  SchemaFilter,
} from '@/modules/datasets/schemaFilters';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId } from '@/utils/chain.utils';

type SchemaField = { path?: string | null; type?: string | null };

export function useSchemaSearch() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { chainId } = useUserStore();

  const navigateToDatasets = (schemaFields: SchemaField[]) => {
    const schemaFilters: SchemaFilter[] = schemaFields
      .filter(
        (field): field is { path: string; type: string } =>
          field.path != null && field.type != null
      )
      .map((field) => ({ path: field.path, type: field.type }));

    const encoded = encodeSchemaFilters(schemaFilters);
    navigate({
      to: `/${getChainFromId(chainId)?.slug}/datasets`,
      search: { ...search, schema: encoded },
      replace: false,
      resetScroll: true,
    });
  };

  const updateCurrentPage = (
    schemaFilters: SchemaFilter[],
    setCurrentPage?: (page: number) => void
  ) => {
    navigate({
      search: { ...search, schema: encodeSchemaFilters(schemaFilters) },
      replace: false,
      resetScroll: true,
    });
    setCurrentPage?.(0);
  };

  return {
    navigateToDatasets,
    updateCurrentPage,
  };
}
