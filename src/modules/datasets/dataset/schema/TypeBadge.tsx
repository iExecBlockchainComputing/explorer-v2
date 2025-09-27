import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { pluralize } from '@/utils/pluralize';
import { borderTypeColor } from '../../borderTypeColor';
import { SchemaFilter } from '../../schemaFilters';

export interface TypeBadgeProps {
  schemaPaths?: SchemaFilter[];
  isLoading?: boolean;
  maxVisible?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  overflowHidden?: boolean;
  enableTooltip?: boolean;
  onSchemaSearch?: (schema: SchemaFilter) => void;
}

const getBorderColor = (type: string) => {
  return borderTypeColor.find((color) =>
    color.keywords.some((keyword) => type?.toLowerCase().includes(keyword))
  )?.color;
};

const renderBadge = (
  schema: { path: string; type: string },
  overflowHidden: boolean
) => (
  <span
    key={schema.path + schema.type}
    className={cn(
      'inline-flex w-fit rounded-full border px-4 py-2 text-xs',
      getBorderColor(schema.type),
      overflowHidden && 'max-w-36'
    )}
    title={overflowHidden ? `${schema.path}: ${schema.type}` : undefined}
  >
    <span
      className={cn(
        'inline-block',
        overflowHidden && 'max-w-18 truncate overflow-hidden text-ellipsis'
      )}
    >
      {schema.path}
    </span>
    <span
      className={cn(
        'inline-block min-w-0 flex-1',
        overflowHidden && 'truncate overflow-hidden text-ellipsis'
      )}
    >
      : {schema.type}
    </span>
  </span>
);

const renderTooltipContent = (
  schemaPaths: { path: string; type: string }[],
  onSchemaSearch?: (schema: SchemaFilter[]) => void
) => (
  <div className="flex flex-col gap-1">
    {schemaPaths.map((schema) => (
      <div
        key={schema.path + schema.type}
        className={cn(
          'rounded-full border px-3 py-1 text-xs whitespace-nowrap',
          getBorderColor(schema.type)
        )}
      >
        <span className="font-semibold">{schema.path}</span>
        <span>: {schema.type}</span>
      </div>
    ))}
    {onSchemaSearch && (
      <button
        className="text-foreground flex justify-center gap-1 pt-2 text-xs hover:underline"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onSchemaSearch(schemaPaths);
        }}
      >
        Search schemas <Search size="16" />
      </button>
    )}
  </div>
);

const TypeBadge: React.FC<TypeBadgeProps> = ({
  schemaPaths,
  isLoading,
  maxVisible = 2,
  direction = 'vertical',
  className,
  overflowHidden = true,
  enableTooltip = false,
  onSchemaSearch,
}) => {
  if (isLoading && schemaPaths && schemaPaths.length === 0) {
    return (
      <span className="border-muted-foreground text-muted-foreground inline-flex rounded-full border px-4 py-2 text-xs">
        Loading...
      </span>
    );
  }
  if (!schemaPaths || schemaPaths.length === 0) {
    return <span className="text-muted-foreground">No type</span>;
  }
  const visibleItems = schemaPaths.slice(0, maxVisible);
  const hiddenCount = schemaPaths.length - visibleItems.length;

  const badges = [
    ...visibleItems.map((schema) =>
      renderBadge(
        {
          path: schema.path ?? '',
          type: schema.type ?? '',
        },
        overflowHidden
      )
    ),
    hiddenCount > 0 ? (
      <span
        key="more"
        className="text-muted-foreground w-fit cursor-pointer text-xs"
      >
        +{pluralize(hiddenCount, 'other')}
      </span>
    ) : null,
  ];

  const safeSchemaPaths = schemaPaths.map((schema) => ({
    path: schema.path ?? '',
    type: schema.type ?? '',
  }));

  const content = (
    <div
      className={cn(
        `flex`,
        direction === 'vertical'
          ? 'flex-col gap-2'
          : 'flex-row flex-wrap gap-4',
        className
      )}
    >
      {badges}
      {!enableTooltip && onSchemaSearch && (
        <button
          className="flex items-center gap-1 text-xs hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onSchemaSearch(schemaPaths);
          }}
        >
          Search schemas <Search size="16" />
        </button>
      )}
    </div>
  );

  if (!enableTooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          {renderTooltipContent(safeSchemaPaths, onSchemaSearch)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TypeBadge;
