import { processSchemaPathsToTypes } from '@/modules/datasets/utils/datasetTypeUtils';


interface DatasetTypesProps {
  schemaPaths?: Array<{ path?: string | null; type?: string | null }>;
  isLoading?: boolean;
  layout?: 'horizontal' | 'vertical';
  maxDisplay?: number;
  showMoreCount?: boolean;
  constrainWidth?: boolean; // Whether to constrain the width of each type card
}

export function DatasetTypes({
  schemaPaths,
  isLoading,
  layout = 'horizontal',
  maxDisplay,
  showMoreCount = false,
  constrainWidth = true, // Default to true for table views
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
        <div
          key={type.name}
          className={`inline-block w-fit cursor-pointer rounded-lg border px-2 py-1 text-sm font-medium transition-transform duration-200 hover:scale-105 ${
            constrainWidth ? 'max-w-40' : ''
          }`}
          style={type.style}
          title={type.type ? `${type.name} (${type.type})\nFull path: ${type.fullPath}` : `${type.name}\nFull path: ${type.fullPath}`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span
              className={`w-full text-center ${constrainWidth ? 'truncate' : ''}`}
            >
              {type.name}
            </span>
            {type.type && (
              <span
                className={`w-full rounded bg-black/10 px-1 py-0.5 text-center text-xs font-normal opacity-70 ${
                  constrainWidth ? 'truncate' : ''
                }`}
              >
                {type.type}
              </span>
            )}
          </div>
        </div>
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
