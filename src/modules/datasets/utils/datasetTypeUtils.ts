export interface DatasetTypeInfo {
  name: string;
  style: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
}

// Simple hash function to convert string to number
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Function to create a dynamic type for any path
export function createDynamicType(path: string): DatasetTypeInfo {
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
    style: {
      backgroundColor: `hsla(${hue}, 60%, 50%, 0.08)`,
      borderColor: `hsla(${hue}, 60%, 50%, 0.2)`,
      color: `hsl(${hue}, 60%, 40%)`
    }
  };
}

// Function to process schema paths into types
export function processSchemaPathsToTypes(schemaPaths?: Array<{ path?: string | null }>): DatasetTypeInfo[] {
  if (!schemaPaths || schemaPaths.length === 0) {
    return [];
  }

  return schemaPaths
    .map((item) => {
      if (!item.path) return null;
      return createDynamicType(item.path);
    })
    .filter(Boolean) as DatasetTypeInfo[];
}
