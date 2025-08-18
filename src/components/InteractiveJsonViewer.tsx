import JsonView from '@uiw/react-json-view';

interface JsonViewerProps {
  schemaPaths?: Array<{ path?: string | null; type?: string | null }>;
  className?: string;
}

interface JsonNode {
  [key: string]: JsonNode | string;
}

function buildJsonStructure(
  schemaPaths: Array<{ path?: string | null; type?: string | null }>
): JsonNode {
  const result: JsonNode = {};

  schemaPaths.forEach(({ path, type }) => {
    if (!path || !type) return;

    const parts = path.split('.');
    let current = result;

    // Navigate through the path, creating nested objects
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as JsonNode;
    }

    // Set the final value with its type
    const lastPart = parts[parts.length - 1];
    current[lastPart] = type;
  });

  return result;
}

export function InteractiveJsonViewer({
  schemaPaths,
  className,
}: JsonViewerProps) {
  if (!schemaPaths || schemaPaths.length === 0) {
    return (
      <div className={`${className} text-muted-foreground text-sm`}>
        No schema data available
      </div>
    );
  }

  const jsonStructure = buildJsonStructure(schemaPaths);

  return (
    <div className={`${className} max-h-96 overflow-y-auto`}>
      <JsonView
        value={jsonStructure}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        collapsed={2} // Collapse after 2 levels for compact view
        style={
          {
            backgroundColor: 'transparent',
            fontFamily: "'Space Mono', monospace", // Use project's monospace font
            color: 'rgb(229 231 235)', // text-gray-200 for better contrast
            '--w-rjv-key-string': 'rgb(229 231 235)', // Override key color to light gray
            '--w-rjv-type-string-color': 'rgb(251 146 60)', // Keep orange for values
            '--w-rjv-type-boolean-color': 'rgb(34 197 94)', // Keep green for booleans
            '--w-rjv-indent-width': '24px', // Increase indentation for nested keys
          } as React.CSSProperties
        }
      />
    </div>
  );
}
