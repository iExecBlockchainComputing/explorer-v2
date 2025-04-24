/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Apps($length: Int = 20, $skip: Int = 0) {\n    apps(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      type\n      multiaddr\n      checksum\n      mrenclave\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": typeof types.AppsDocument,
    "\n  query Datasets($length: Int = 20, $skip: Int = 0) {\n    datasets(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      multiaddr\n      checksum\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": typeof types.DatasetsDocument,
    "\n  query Deals($length: Int = 20, $skip: Int = 0) {\n    deals(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      dealid: id\n      timestamp\n      requester {\n        address: id\n      }\n      beneficiary {\n        address: id\n      }\n      callback {\n        address: id\n      }\n      app {\n        address: id\n      }\n      dataset {\n        address: id\n      }\n      workerpool {\n        address: id\n      }\n      category {\n        catid: id\n        workClockTimeRef\n      }\n      startTime\n      appPrice\n      datasetPrice\n      workerpoolPrice\n      botSize\n      trust\n      completedTasksCount\n      claimedTasksCount\n    }\n  }\n": typeof types.DealsDocument,
    "\n  query Tasks($length: Int = 20, $skip: Int = 0) {\n    tasks(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      taskid: id\n      index\n      finalDeadline\n      status\n      timestamp\n      deal {\n        requester {\n          address: id\n        }\n        beneficiary {\n          address: id\n        }\n        app {\n          address: id\n        }\n        dataset {\n          address: id\n        }\n        workerpool {\n          address: id\n        }\n        category {\n          catid: id\n          workClockTimeRef\n        }\n      }\n    }\n  }\n": typeof types.TasksDocument,
    "\n  query Workerpools($length: Int = 20, $skip: Int = 0) {\n    workerpools(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      description\n      workerStakeRatio\n      schedulerRewardRatio\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": typeof types.WorkerpoolsDocument,
};
const documents: Documents = {
    "\n  query Apps($length: Int = 20, $skip: Int = 0) {\n    apps(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      type\n      multiaddr\n      checksum\n      mrenclave\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": types.AppsDocument,
    "\n  query Datasets($length: Int = 20, $skip: Int = 0) {\n    datasets(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      multiaddr\n      checksum\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": types.DatasetsDocument,
    "\n  query Deals($length: Int = 20, $skip: Int = 0) {\n    deals(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      dealid: id\n      timestamp\n      requester {\n        address: id\n      }\n      beneficiary {\n        address: id\n      }\n      callback {\n        address: id\n      }\n      app {\n        address: id\n      }\n      dataset {\n        address: id\n      }\n      workerpool {\n        address: id\n      }\n      category {\n        catid: id\n        workClockTimeRef\n      }\n      startTime\n      appPrice\n      datasetPrice\n      workerpoolPrice\n      botSize\n      trust\n      completedTasksCount\n      claimedTasksCount\n    }\n  }\n": types.DealsDocument,
    "\n  query Tasks($length: Int = 20, $skip: Int = 0) {\n    tasks(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      taskid: id\n      index\n      finalDeadline\n      status\n      timestamp\n      deal {\n        requester {\n          address: id\n        }\n        beneficiary {\n          address: id\n        }\n        app {\n          address: id\n        }\n        dataset {\n          address: id\n        }\n        workerpool {\n          address: id\n        }\n        category {\n          catid: id\n          workClockTimeRef\n        }\n      }\n    }\n  }\n": types.TasksDocument,
    "\n  query Workerpools($length: Int = 20, $skip: Int = 0) {\n    workerpools(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      description\n      workerStakeRatio\n      schedulerRewardRatio\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n": types.WorkerpoolsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Apps($length: Int = 20, $skip: Int = 0) {\n    apps(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      type\n      multiaddr\n      checksum\n      mrenclave\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').AppsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Datasets($length: Int = 20, $skip: Int = 0) {\n    datasets(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      name\n      multiaddr\n      checksum\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').DatasetsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Deals($length: Int = 20, $skip: Int = 0) {\n    deals(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      dealid: id\n      timestamp\n      requester {\n        address: id\n      }\n      beneficiary {\n        address: id\n      }\n      callback {\n        address: id\n      }\n      app {\n        address: id\n      }\n      dataset {\n        address: id\n      }\n      workerpool {\n        address: id\n      }\n      category {\n        catid: id\n        workClockTimeRef\n      }\n      startTime\n      appPrice\n      datasetPrice\n      workerpoolPrice\n      botSize\n      trust\n      completedTasksCount\n      claimedTasksCount\n    }\n  }\n"): typeof import('./graphql').DealsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Tasks($length: Int = 20, $skip: Int = 0) {\n    tasks(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      taskid: id\n      index\n      finalDeadline\n      status\n      timestamp\n      deal {\n        requester {\n          address: id\n        }\n        beneficiary {\n          address: id\n        }\n        app {\n          address: id\n        }\n        dataset {\n          address: id\n        }\n        workerpool {\n          address: id\n        }\n        category {\n          catid: id\n          workClockTimeRef\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TasksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Workerpools($length: Int = 20, $skip: Int = 0) {\n    workerpools(\n      first: $length\n      skip: $skip\n      orderBy: timestamp\n      orderDirection: desc\n    ) {\n      address: id\n      owner {\n        address: id\n      }\n      timestamp\n      description\n      workerStakeRatio\n      schedulerRewardRatio\n      transfers(orderBy: timestamp, orderDirection: desc) {\n        transaction {\n          txHash: id\n          timestamp\n          blockNumber\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').WorkerpoolsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
