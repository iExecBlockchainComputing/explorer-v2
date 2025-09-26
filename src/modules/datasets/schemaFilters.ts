export type SchemaFilter = { path: string; type: string };

export function decodeSchemaFilters(str?: string): SchemaFilter[] {
  if (!str) return [];
  return str
    .split(',')
    .map((pair) => {
      const [path, type] = pair.split(':');
      return path && type ? { path, type } : null;
    })
    .filter(Boolean) as SchemaFilter[];
}

export function encodeSchemaFilters(filters: SchemaFilter[]): string {
  return filters.map((f) => `${f.path}:${f.type}`).join(',');
}
