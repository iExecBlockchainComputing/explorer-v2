import { DatasetSchemaQuery } from '@/graphql/dataprotector/graphql';
import { cn } from '@/lib/utils';
import React from 'react';
import { pluralize } from '@/utils/pluralize';
import { borderTypeColor } from '../../borderTypeColor';

interface TypeBadgeProps {
  schemaPaths?: NonNullable<
    NonNullable<DatasetSchemaQuery['protectedData']>['schema']
  >;
  isLoading?: boolean;
  maxVisible?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  overflowHidden?: boolean;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({
  schemaPaths,
  isLoading,
  maxVisible = 2,
  direction = 'vertical',
  className,
  overflowHidden = true,
}) => {
  if (isLoading && schemaPaths && schemaPaths.length === 0) {
    return (
      <span className="border-muted-foreground text-muted-foreground rounded-full border px-4 py-2 text-xs">
        Loading...
      </span>
    );
  }
  if (!schemaPaths || schemaPaths.length === 0) {
    return <span className="text-muted-foreground">No type</span>;
  }
  const visibleItems = schemaPaths.slice(0, maxVisible);
  const hiddenCount = schemaPaths.length - visibleItems.length;

  return (
    <div
      className={cn(
        `flex`,
        direction === 'vertical'
          ? 'flex-col gap-2'
          : 'flex-row flex-wrap gap-4',
        className
      )}
    >
      {visibleItems.map((schema, index) => {
        const borderColor = borderTypeColor.find((color) =>
          color.keywords.some((keyword) =>
            schema.type?.toLowerCase().includes(keyword)
          )
        )?.color;
        return (
          <span
            key={index}
            className={cn(
              'inline-flex w-fit rounded-full border px-4 py-2 text-xs',
              borderColor,
              overflowHidden && 'max-w-36'
            )}
            title={
              overflowHidden ? `${schema.path}: ${schema.type}` : undefined
            }
          >
            <span
              className={cn(
                'inline-block',
                overflowHidden &&
                  'max-w-18 truncate overflow-hidden text-ellipsis'
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
      })}
      {hiddenCount > 0 && (
        <span className="w-fit text-xs text-gray-500 hover:bg-gray-100">
          +{pluralize(hiddenCount, 'other')}
        </span>
      )}
    </div>
  );
};

export default TypeBadge;
