import {
  LEGACY_TYPES,
  SUPPORTED_MIME_TYPES,
  COMMON_DATA_TYPES,
  POPULAR_MIME_TYPES,
} from '@/config';
import { cn } from '@/lib/utils';
import { Plus, X, Filter, ChevronDown } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SchemaFilter {
  id: string;
  path: string;
  type: string;
}

type PopularMimeType = (typeof POPULAR_MIME_TYPES)[number];

interface SchemaSearchProps {
  className?: string;
  onFiltersChanged?: (filters: SchemaFilter[]) => void;
  filters: SchemaFilter[];
}

export function SchemaSearch({
  className,
  onFiltersChanged,
  filters,
}: SchemaSearchProps) {
  const [isOpen, setIsOpen] = useState(true); // Ouvert par défaut pour une meilleure UX
  const [newPath, setNewPath] = useState('');
  const [newType, setNewType] = useState<string>('');

  const addFilter = useCallback(() => {
    if (!newPath.trim() || !newType) {
      return;
    }

    const newFilter: SchemaFilter = {
      id: Math.random().toString(36).substr(2, 9),
      path: newPath.trim(),
      type: newType,
    };

    const updatedFilters = [...filters, newFilter];
    onFiltersChanged?.(updatedFilters);
    setNewPath('');
    setNewType('');
  }, [newPath, newType, filters, onFiltersChanged]);

  const removeFilter = useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter((f) => f.id !== filterId);
      onFiltersChanged?.(updatedFilters);
    },
    [filters, onFiltersChanged]
  );

  const clearFilters = useCallback(() => {
    onFiltersChanged?.([]);
  }, [onFiltersChanged]);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Collapsible trigger */}
      <Button
        variant="outline"
        className="border-primary/20 hover:border-primary/40 w-full justify-start gap-2"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span className="font-semibold">Advanced Schema Search</span>
        <span className="text-muted-foreground text-xs">
          {isOpen
            ? 'Filter datasets by field types'
            : 'Click to add schema filters'}
        </span>
        {filters.length > 0 && (
          <span className="bg-primary text-primary-foreground ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">
            {filters.length} filter{filters.length > 1 ? 's' : ''}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="border-border/50 bg-muted/30 space-y-4 rounded-lg border p-4 pt-4">
          {/* Add New Filter - En premier pour une meilleure UX */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Plus size={16} className="text-primary" />
              Filter by Field Type
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="Field path (e.g., email, user.email, nested.field)"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPath && newType) {
                    addFilter();
                  }
                }}
              />
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {/* Common Data Types */}
                  <div className="text-muted-foreground border-b p-2 text-xs font-medium">
                    📝 Common Types
                  </div>
                  {COMMON_DATA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="font-mono text-green-600">{type}</span>
                    </SelectItem>
                  ))}

                  {/* Legacy Types */}
                  <div className="text-muted-foreground mt-2 border-b p-2 text-xs font-medium">
                    ⚠️ Legacy Common Types (deprecated)
                  </div>
                  {LEGACY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="font-mono text-orange-600">{type}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        (legacy)
                      </span>
                    </SelectItem>
                  ))}

                  {/* Popular MIME Types */}
                  <div className="text-muted-foreground mt-2 border-b p-2 text-xs font-medium">
                    🗂️ Popular File Types
                  </div>
                  {POPULAR_MIME_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="font-mono text-blue-600">{type}</span>
                    </SelectItem>
                  ))}

                  {/* All Other MIME Types */}
                  <div className="text-muted-foreground mt-2 border-b p-2 text-xs font-medium">
                    📎 Other File Types
                  </div>
                  {SUPPORTED_MIME_TYPES.filter(
                    (t) => !POPULAR_MIME_TYPES.includes(t as PopularMimeType)
                  ).map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="font-mono text-blue-400">{type}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={addFilter}
                disabled={!newPath.trim() || !newType}
                size="icon"
                className="shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
            {/* Helper text */}
            <p className="text-muted-foreground text-xs">
              Add field types to filter datasets by their schema structure.
              Filters are applied automatically.
            </p>
          </div>

          {/* Current Filters - Affiché en dessous, seulement s'il y en a */}
          {filters.length > 0 && (
            <div className="border-border/50 space-y-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Filter size={16} className="text-primary" />
                  Active Filters ({filters.length})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="hover:bg-destructive/10 hover:text-destructive h-7 px-3 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <span
                    key={filter.id}
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  >
                    <span className="text-primary font-mono">
                      {filter.path}:{filter.type}
                    </span>
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="hover:bg-destructive/20 hover:text-destructive ml-1 rounded-full p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
