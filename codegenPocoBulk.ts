import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.VITE_POCO_BULK_SUBGRAPH_URL,
  documents: ['src/**/*PocoBulkQuery.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/pocoBulk/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
    './src/graphql/pocoBulk/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}
 
export default config