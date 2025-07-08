import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

export function initRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadDelay: 2000,
    defaultPreloadStaleTime: 0,
  });
}
