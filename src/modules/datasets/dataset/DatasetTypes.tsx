import React from 'react';

interface DatasetType {
  name: string;
  color: string;
  style?: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
}

// Simple hash function to convert string to number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Function to create a dynamic type for any path
function createDynamicType(path: string): DatasetType {
  const hash = hashString(path);
  const hue = hash % 360;
  
  // Convert path to a readable name (e.g., "targetPrivacyPassV2_prod" -> "Target Privacy Pass V2 Prod")
  const name = path
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+./g, str => str.toUpperCase()) // Capitalize first letter of each word
    .trim();

  return {
    name,
    color: '', // We'll use inline styles instead
    style: {
      backgroundColor: `hsla(${hue}, 60%, 50%, 0.08)`,
      borderColor: `hsla(${hue}, 60%, 50%, 0.2)`,
      color: `hsl(${hue}, 60%, 40%)`
    }
  };
}

interface DatasetTypesProps {
  schemaPaths?: Array<{ path?: string | null }>;
  isLoading?: boolean;
}

export function DatasetTypes({ schemaPaths, isLoading }: DatasetTypesProps) {
  // Create types from schema paths
  let displayTypes: DatasetType[] = [];
  
  if (schemaPaths && schemaPaths.length > 0) {
    displayTypes = schemaPaths
      .map((item) => {
        if (!item.path) return null;
        return createDynamicType(item.path);
      })
      .filter(Boolean) as DatasetType[];
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 p-3 rounded-lg border bg-muted animate-pulse w-40"
          >
            <div className="flex-1">
              <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-3 bg-muted-foreground/10 rounded w-3/4"></div>
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
          className="flex-shrink-0 p-3 rounded-lg border hover:scale-105 transition-transform duration-200 cursor-pointer w-auto"
          style={type.style}
        >
          <div className="flex items-center justify-center">
            <h3 className="font-semibold text-sm break-words leading-tight text-center whitespace-normal">{type.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
} 
