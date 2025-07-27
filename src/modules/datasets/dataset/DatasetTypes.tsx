import {
  processSchemaPathsToTypes,
  DatasetTypeInfo,
} from '../utils/datasetTypeUtils';

interface DatasetTypesProps {
  schemaPaths?: Array<{ path?: string | null }>;
  isLoading?: boolean;
}

export function DatasetTypes({ schemaPaths, isLoading }: DatasetTypesProps) {
  // Create types from schema paths using shared utility
  const displayTypes: DatasetTypeInfo[] =
    processSchemaPathsToTypes(schemaPaths);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-muted w-40 flex-shrink-0 animate-pulse rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="bg-muted-foreground/20 mb-2 h-4 rounded"></div>
              <div className="bg-muted-foreground/10 h-3 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {displayTypes.map((type) => (
        <div
          key={type.name}
          className="w-auto flex-shrink-0 cursor-pointer rounded-lg border p-3 transition-transform duration-200 hover:scale-105"
          style={type.style}
        >
          <div className="flex items-center justify-center">
            <h3 className="text-center text-sm leading-tight font-semibold break-words whitespace-normal">
              {type.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
