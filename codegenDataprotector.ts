import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.VITE_DATAPROTECTOR_SUBGRAPH_URL,
  // documents: ['src/**/*.tsx', "src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/dataprotector/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
    './src/graphql/dataprotector/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}
 
export default config