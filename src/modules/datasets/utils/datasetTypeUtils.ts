export interface DatasetTypeInfo {
  name: string;
  type?: string; // Data type like 'string', 'boolean', etc.
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
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Function to create a dynamic type for any path
export function createDynamicType(
  path: string,
  type?: string
): DatasetTypeInfo {
  const hash = hashString(path);

  // Create a more varied hash by combining multiple factors
  const pathLength = path.length;
  const firstChar = path.charCodeAt(0);
  const lastChar = path.charCodeAt(path.length - 1);
  const complexHash =
    (hash + pathLength * 17 + firstChar * 31 + lastChar * 13) % 360;

  // Define distinct color palette with good separation
  const distinctColors = [
    20, // Orange-red
    45, // Orange
    70, // Yellow-orange
    95, // Yellow-green
    120, // Green
    145, // Blue-green
    170, // Cyan
    195, // Light blue (but shifted to avoid dark blue)
    280, // Purple
    305, // Magenta
    330, // Pink-red
    350, // Red-orange
  ];

  // Use modulo to select from our distinct color palette
  const colorIndex = complexHash % distinctColors.length;
  const selectedHue = distinctColors[colorIndex];

  // Add slight variation based on the original hash to avoid exact duplicates
  const hueVariation = (hash % 20) - 10; // -10 to +10 degrees variation
  const finalHue = (selectedHue + hueVariation + 360) % 360;

  // Convert path to a readable name (e.g., "targetPrivacyPassV2_prod" -> "Target Privacy Pass V2 Prod")
  const name = path
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+./g, (str) => str.toUpperCase()) // Capitalize first letter of each word
    .trim();

  return {
    name,
    type,
    style: {
      backgroundColor: `hsla(${finalHue}, 80%, 60%, 0.15)`,
      borderColor: `hsla(${finalHue}, 80%, 60%, 0.4)`,
      color: `hsl(${finalHue}, 80%, 65%)`,
    },
  };
} // Function to process schema paths into types
export function processSchemaPathsToTypes(
  schemaPaths?: Array<{ path?: string | null; type?: string | null }>
): DatasetTypeInfo[] {
  if (!schemaPaths || schemaPaths.length === 0) {
    return [];
  }

  return schemaPaths
    .map((item) => {
      if (!item.path) return null;
      return createDynamicType(item.path, item.type || undefined);
    })
    .filter(Boolean) as DatasetTypeInfo[];
}
