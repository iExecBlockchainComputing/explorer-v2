import { graphql } from '@/graphql/dataprotector/gql';


export const datasetSchemaQuery = graphql(`
  query DatasetSchema($datasetAddress: ID!) {
    protectedData(id: $datasetAddress) {
      schema {
        path
        type
      }
    }
  }
`);

// Query optimisée en string pour utiliser avec executeDataprotector
export const optimizedProtectedDatasQueryString = graphql(`
  query OptimizedProtectedDatasWithSchemas($datasetIds: [Bytes!]!) {
    protectedDatas(where: { id_in: $datasetIds }) {
      id
      schema {
        path
        type
      }
    }
  }
`);

// Query pour la recherche par schéma avec pagination optimisée et filtrage côté serveur
export const schemaSearchPaginatedQuery = graphql(`
  query SchemaSearchPaginated(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $requiredSchema: [String!]
  ) {
    protectedDatas(
      where: {
        transactionHash_not: "0x"
        schema_contains: $requiredSchema
      }
      skip: $skip
      first: $length
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      id
      name
      creationTimestamp
      owner {
        id
      }
      schema {
        path
        type
      }
    }
    protectedDatasHasNext: protectedDatas(
      where: {
        transactionHash_not: "0x"
        schema_contains: $requiredSchema
      }
      first: 1
      skip: $nextSkip
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      id
    }
    protectedDatasHasNextNext: protectedDatas(
      where: {
        transactionHash_not: "0x"
        schema_contains: $requiredSchema
      }
      first: 1
      skip: $nextNextSkip
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      id
    }
  }
`);
