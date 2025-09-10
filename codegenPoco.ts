import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.VITE_POCO_SUBGRAPH_URL,
  documents: ['src/**/*.tsx', "src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/poco/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
    './src/graphql/poco/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}
 
export default config