import { datasetSchemaTypeGroups } from '@/config';
import { cn } from '@/lib/utils';
import { SelectLabel } from '@radix-ui/react-select';
import { ChevronDown, Plus, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { borderTypeColor } from './borderTypeColor';
import { SchemaFilter } from './schemaFilters';

export interface SchemaSearchProps {
  filters: SchemaFilter[];
  onAddFilter: (filter: SchemaFilter) => void;
  onRemoveFilter: (index: number) => void;
  onClearAllFilters?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SchemaSearch({
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearAllFilters,
  isOpen,
  setIsOpen,
}: SchemaSearchProps) {
  const [inputPathValue, setInputPathValue] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const handleAdd = () => {
    if (!inputPathValue.trim() || !selectedType) return;
    onAddFilter({ path: inputPathValue.trim(), type: selectedType });
    setInputPathValue('');
    setSelectedType('');
  };

  return (
    <div className="rounded-2xl border">
      <button
        className={cn('flex w-full items-center gap-2 px-10 py-6 duration-200')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal size={16} />
        <p className="flex-1 text-left font-bold">
          Schema Search{' '}
          <span className="text-muted-foreground font-normal">
            Add field types to filter datasets by their schema structure.
            Filters are applied automatically.
          </span>
        </p>
        <ChevronDown
          className={cn(
            'ml-auto transition-transform',
            isOpen && '-rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          isOpen
            ? 'translate-y-0 grid-rows-[1fr]'
            : 'translate-y-2 grid-rows-[0fr]'
        )}
      >
        <div className={cn('grid overflow-hidden px-6 md:px-10')}>
          <hr className="border-secondary" />
          <div
            className={cn(
              'grid transition-all duration-200',
              filters.length > 0
                ? 'mt-6 translate-y-0 grid-rows-[1fr]'
                : 'translate-y-2 grid-rows-[0fr]'
            )}
          >
            <div className="flex flex-wrap items-center gap-2.5 overflow-hidden">
              <span className="text-muted-foreground">
                Filter by field types:
              </span>{' '}
              {filters.map((schema, index) => {
                const borderColor = borderTypeColor.find((color) =>
                  color.keywords.some((keyword) =>
                    schema.type?.toLowerCase().includes(keyword)
                  )
                )?.color;
                return (
                  <span
                    key={index}
                    className={cn(
                      'inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs',
                      borderColor
                    )}
                  >
                    <span className={cn('inline-block')}>{schema.path}</span>
                    <span className={cn('inline-block')}>: {schema.type}</span>
                    <button onClick={() => onRemoveFilter(index)}>
                      <X className="ml-1" size={12} />
                    </button>
                  </span>
                );
              })}
              {filters.length > 0 && (
                <button
                  className="text-xs"
                  type="button"
                  onClick={onClearAllFilters}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 mb-6 flex translate-y-1 flex-col items-center gap-4 sm:flex-row">
            <Input
              type="text"
              id="schema-path"
              autoComplete="off"
              autoCapitalize="off"
              value={inputPathValue}
              onChange={(e) => setInputPathValue(e.target.value)}
              className={cn(
                'bg-muted border-secondary col-span-2 w-full rounded-2xl px-4 py-6 text-sm'
              )}
              placeholder="Field path (e.g email, telegram_chatId, nested)"
            />

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-muted border-secondary w-full rounded-2xl px-4 py-6 text-sm sm:max-w-1/3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-muted border-secondary overflow-visible p-6">
                {datasetSchemaTypeGroups.map((group) => (
                  <SelectGroup
                    key={group.label}
                    className="overflow-visible not-first:mt-2"
                  >
                    <SelectLabel className="text-muted-foreground text-sm">
                      {group.label}
                    </SelectLabel>
                    {group.items.map((type) => (
                      <SelectItem
                        key={type.value}
                        className="data-[state=checked]:text-primary text-base font-bold"
                        value={type.value}
                      >
                        {type.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="lg"
              onClick={handleAdd}
              disabled={!inputPathValue.trim() || !selectedType}
            >
              Add filter
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
