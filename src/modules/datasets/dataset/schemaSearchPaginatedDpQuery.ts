import { graphql } from '@/graphql/dataprotector/gql';

export const schemaSearchPaginatedQuery = graphql(`
  query SchemaSearchPaginated(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $requiredSchema: [String!]
  ) {
    protectedDatas(
      where: { transactionHash_not: "0x", schema_contains: $requiredSchema }
      skip: $skip
      first: $length
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      address: id
      owner {
        address: id
      }
      name
      timestamp: creationTimestamp
      transactionHash
      schema {
        path
        type
      }
    }
    protectedDatasHasNext: protectedDatas(
      where: { transactionHash_not: "0x", schema_contains: $requiredSchema }
      first: 1
      skip: $nextSkip
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      id
    }
    protectedDatasHasNextNext: protectedDatas(
      where: { transactionHash_not: "0x", schema_contains: $requiredSchema }
      first: 1
      skip: $nextNextSkip
      orderBy: creationTimestamp
      orderDirection: desc
    ) {
      id
    }
  }
`);
