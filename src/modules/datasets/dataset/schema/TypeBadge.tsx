import { DatasetSchemaQuery } from '@/graphql/dataprotector/graphql';
import { cn } from '@/lib/utils';
import React from 'react';
import { pluralize } from '@/utils/pluralize';

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

const borderTypeColor = [
  { keywords: ['string'], color: 'border-yellow-500 text-yellow-200' },
  { keywords: ['video'], color: 'border-orange-300 text-orange-300' },
  { keywords: ['bool'], color: 'border-blue-200 text-blue-200' },
  { keywords: ['application'], color: 'border-blue-400 text-blue-400' },
  { keywords: ['audio'], color: 'border-[#A0B1FE] text-[#A0B1FE]' },
  { keywords: ['f64'], color: 'border-green-200 text-green-200' },
  { keywords: ['i128'], color: 'border-purple-200 text-purple-200' },
  { keywords: ['image'], color: 'border-[#F05FC5] text-[#F05FC5]' },
  { keywords: ['number'], color: 'border-[#F693B8] text-[#F693B8]' },
  { keywords: ['boolean'], color: 'border-purple-100 text-purple-100' },
];

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
