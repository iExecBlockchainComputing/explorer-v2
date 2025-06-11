import { graphql } from '@/graphql/gql';

export const transactionEventQuery = graphql(`
  query TransactionEvent($transactionAddress: String!) {
    appTransfers(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      app {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    datasetTransfers(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      dataset {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    workerpoolTransfers(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      workerpool {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    rewards(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
      value
      task {
        taskid: id
      }
    }
    seizes(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
      value
      task {
        taskid: id
      }
    }
    locks(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
      value
    }
    unlocks(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
      value
    }
    accurateContributions(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
    }
    faultyContributions(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      account {
        address: id
      }
    }
    policyUpdates(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      workerpool {
        address: id
      }
    }
    ordersMatcheds(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      deal {
        dealid: id
      }
    }
    schedulerNotices(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      deal {
        dealid: id
      }
      workerpool {
        address: id
      }
    }
    taskInitializes(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskContributes(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
      worker {
        address: id
      }
    }
    taskConsensuses(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskReveals(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskReopens(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskFinalizes(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskClaimeds(where: { transaction: $transactionAddress }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
  }
`);
