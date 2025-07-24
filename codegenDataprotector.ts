import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.VITE_DATAPROTECTOR_SUBGRAPH_URL,
  documents: ['src/modules/datasets/dataset/protectedDataQuery.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/dataprotector/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    }
  }
}

export default config 
