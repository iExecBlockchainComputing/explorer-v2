import { graphql } from '@/graphql/gql';

export const taskQuery = graphql(`
  query Task($taskAddress: ID!) {
    task(id: $taskAddress) {
      taskid: id
      timestamp
      deal {
        dealid: id
        app {
          address: id
          name
        }
        dataset {
          address: id
          name
        }
        workerpool {
          address: id
          description
        }
        beneficiary {
          address: id
        }
        callback {
          address: id
        }
        tag
        trust
        category {
          catid: id
          name
          workClockTimeRef
          description
        }
        botSize
        botFirst
      }
      requester {
        address: id
      }
      index
      status
      contributionDeadline
      revealDeadline
      finalDeadline
      consensus
      resultDigest
      results
      resultsCallback

      # TODO index in subgraph
      # contributions(orderBy: timestamp, orderDirection: asc) {
      #   timestamp
      #   worker {
      #     address: id
      #     score
      #   }
      #   hash
      #   seal
      #   challenge
      # }

      taskEvents: events(orderBy: timestamp, orderDirection: asc) {
        timestamp
        id
        type: __typename
        transaction {
          txHash: id
        }
        # ... on TaskInitialize { } # nothing more
        ... on TaskContribute {
          worker {
            address: id
          }
          hash
        }
        ... on TaskConsensus {
          consensus
        }
        ... on TaskReveal {
          digest
          worker {
            address: id
          }
        }
        # ... on TaskReopen { } # nothing more
        ... on TaskFinalize {
          results
          # resultsCallback # TODO add in subgraph
        }
        # ... on TaskClaimed { } # nothing more
      }
    }
  }
`);
