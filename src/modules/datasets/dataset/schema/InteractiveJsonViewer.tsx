import { DatasetSchemaQuery } from '@/graphql/dataprotector/graphql';
import JsonView from '@uiw/react-json-view';

interface JsonViewerProps {
  schemaPaths?: Array<{ path?: string | null; type?: string | null }>;
  className?: string;
}

interface JsonNode {
  [key: string]: JsonNode | string;
}

function buildJsonStructure(
  schemaPaths: NonNullable<
    NonNullable<DatasetSchemaQuery['protectedData']>['schema']
  >
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
        collapsed={2}
        style={
          {
            color: 'white',
            '--w-rjv-quotes-string-color': '#ffc480', // Override string color to light gray
            '--w-rjv-curlybraces-color': '#728cff', // Override curly braces color to light gray
            '--w-rjv-quotes-color': '#728cff', // Override quotes color to light gray
            '--w-rjv-key-string': 'white', // Override key color to light gray
            '--w-rjv-type-string-color': '#ffc480',
            '--w-rjv-indent-width': '24px', // Increase indentation for nested keys
          } as React.CSSProperties
        }
      />
    </div>
  );
}
