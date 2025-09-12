import { LOCAL_STORAGE_PREFIX } from '@/config';
import { cn } from '@/lib/utils';
import { SelectLabel } from '@radix-ui/react-select';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
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
import { usePageParam } from '@/hooks/usePageParam';
import { borderTypeColor } from './borderTypeColor';
import {
  decodeSchemaFilters,
  encodeSchemaFilters,
  SchemaFilter,
} from './schemaFilters';

const typeGroups = [
  {
    label: 'Common types',
    items: [
      { value: 'string' },
      { value: 'f64' },
      { value: 'i128' },
      { value: 'bool' },
    ],
  },
  {
    label: 'Legacy Common Types (deprecated)',
    items: [{ value: 'number' }, { value: 'boolean' }],
  },
  {
    label: 'Popular File Types',
    items: [
      { value: 'application/pdf' },
      { value: 'image/jpeg' },
      { value: 'image/png' },
      { value: 'image/gif' },
      { value: 'video/mp4' },
    ],
  },
  {
    label: 'Other File Types',
    items: [
      { value: 'application/octet-stream' },
      { value: 'application/xml' },
      { value: 'application/zip' },
      { value: 'image/bmp' },
      { value: 'image/webp' },
      { value: 'video/mpeg' },
      { value: 'video/x-msvideo' },
      { value: 'audio/midi' },
      { value: 'audio/mpeg' },
      { value: 'audio/x-wav' },
    ],
  },
];

export function SchemaSearch(onFiltersChanged?: () => void) {
  const [isOpen, setIsOpen] = useLocalStorageState<boolean>(
    `${LOCAL_STORAGE_PREFIX}_is_datasets_schema_search_open`,
    { defaultValue: true }
  );
  const [inputPathValue, setInputPathValue] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [, setCurrentPage] = usePageParam('datasetsPage');

  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const filters: SchemaFilter[] = decodeSchemaFilters(search?.schema);

  useEffect(() => {
    if (!isOpen && filters.length > 0) {
      setIsOpen(true);
    }
  }, []);

  const handleAddFilter = () => {
    if (!inputPathValue.trim() || !selectedType) return;
    const newFilters: SchemaFilter[] = [
      ...filters.filter(
        (f) => !(f.path === inputPathValue && f.type === selectedType)
      ),
      { path: inputPathValue.trim(), type: selectedType },
    ];
    navigate({
      search: { ...search, schema: encodeSchemaFilters(newFilters) },
      replace: true,
      resetScroll: false,
    });
    setInputPathValue('');
    setSelectedType('');
    setCurrentPage(0);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    const newSearch = { ...search };
    if (newFilters.length === 0) {
      delete newSearch.schema;
    } else {
      newSearch.schema = encodeSchemaFilters(newFilters);
    }
    navigate({
      search: newSearch,
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <div className="rounded-2xl border border-[#303038]">
      <button
        className={cn('flex w-full items-center gap-2 px-10 py-6 duration-300')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal size={16} />
        <div className="flex-1 text-left">Schema Search</div>
        <ChevronDown
          className={cn(
            'ml-auto transition-transform',
            isOpen && '-rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300',
          isOpen
            ? 'translate-y-0 grid-rows-[1fr]'
            : 'translate-y-2 grid-rows-[0fr]'
        )}
      >
        <div className={cn('text-grey-200 grid overflow-hidden px-6 md:px-10')}>
          <hr className="border-secondary" />
          <div
            className={cn(
              'grid transition-all duration-300',
              filters.length > 0
                ? 'mt-6 translate-y-0 grid-rows-[1fr]'
                : 'translate-y-2 grid-rows-[0fr]'
            )}
          >
            <div className="flex flex-wrap items-center gap-2.5 overflow-hidden">
              Filter by field types:{' '}
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
                    <button onClick={() => handleRemoveFilter(index)}>
                      <X className="ml-1 text-white" size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-6 mb-6 flex translate-y-1 gap-4">
            <Input
              value={inputPathValue}
              onChange={(e) => setInputPathValue(e.target.value)}
              className={cn(
                'bg-muted border-secondary col-span-2 w-full rounded-2xl px-4 py-6 text-sm text-white'
              )}
              placeholder="Field path (e.g email, telegram_chatId, nested)"
            />

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-muted border-secondary w-full max-w-1/3 rounded-2xl px-4 py-6 text-sm text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-muted border-secondary overflow-visible p-6">
                {typeGroups.map((group) => (
                  <SelectGroup
                    key={group.label}
                    className="overflow-visible not-first:mt-2"
                  >
                    <SelectLabel className="text-grey-300 text-sm">
                      {group.label}
                    </SelectLabel>
                    {group.items.map((type) => (
                      <SelectItem
                        key={type.value}
                        className="text-base font-bold data-[state=checked]:text-yellow-400"
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
              onClick={handleAddFilter}
              disabled={!inputPathValue.trim() || !selectedType}
            >
              Add filter
            </Button>
          </div>
          {/* {(localError || error) && (
            <p className="bg-danger text-danger-foreground border-danger-border absolute -bottom-8 rounded-full border px-4">
              {localError ? localError.message : error?.message}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}
