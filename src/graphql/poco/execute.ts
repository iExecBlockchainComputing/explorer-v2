import { getSubgraphUrl } from '@/utils/chain.utils';
import type { TypedDocumentString } from './graphql'
 
export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  chainId?: number,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  if (!chainId) {
    throw Error('Missing chainId')
  }
  const subgraphUrl = getSubgraphUrl(chainId);
  const response = await fetch(subgraphUrl.poco, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/graphql-response+json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
 
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
 
  return (await response.json()).data as TResult;
}
