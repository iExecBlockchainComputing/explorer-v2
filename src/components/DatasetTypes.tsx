import { processSchemaPathsToTypes } from '@/modules/datasets/utils/datasetTypeUtils';

interface DatasetTypesProps {
  schemaPaths?: Array<{ path?: string | null }>;
  isLoading?: boolean;
  layout?: 'horizontal' | 'vertical';
  maxDisplay?: number;
  showMoreCount?: boolean;
}

export function DatasetTypes({
  schemaPaths,
  isLoading,
  layout = 'horizontal',
  maxDisplay,
  showMoreCount = false,
}: DatasetTypesProps) {
  const displayTypes = processSchemaPathsToTypes(schemaPaths);

  if (isLoading) {
    const skeletonCount = 5;

    return (
      <div
        className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-1`}
      >
        {Array.from({ length: skeletonCount }, (_, i) => (
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

  if (!schemaPaths || schemaPaths.length === 0 || displayTypes.length === 0) {
    return <span className="text-muted-foreground text-sm">No type</span>;
  }

  const typesToShow = maxDisplay
    ? displayTypes.slice(0, maxDisplay)
    : displayTypes;
  const remainingCount =
    maxDisplay && displayTypes.length > maxDisplay
      ? displayTypes.length - maxDisplay
      : 0;

  return (
    <div
      className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-1 ${layout === 'vertical' ? 'max-w-40' : ''}`}
    >
      {typesToShow.map((type) => (
        <span
          key={type.name}
          className="inline-block w-fit cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium whitespace-nowrap transition-transform duration-200 hover:scale-105"
          style={type.style}
          title={type.name}
        >
          {type.name}
        </span>
      ))}
      {showMoreCount && remainingCount > 0 && (
        <span
          className="text-muted-foreground py-1 text-xs"
          title={`+${remainingCount} more types`}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
