import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/mulish/index.css';
import {
  ErrorBoundary as RollbarErrorBoundary,
  Provider as RollbarProvider,
} from '@rollbar/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { initQueryClient } from './utils/initQueryClient.ts';
import {
  initRollbarAlerting,
  isRollbarActivated,
} from './utils/initRollbarAlerting.ts';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const { rollbar, rollbarConfig } = initRollbarAlerting();

const queryClient = initQueryClient({ rollbar });

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RollbarProvider
          config={isRollbarActivated ? rollbarConfig : undefined}
        >
          <RollbarErrorBoundary>
            <RouterProvider router={router} />
          </RollbarErrorBoundary>
        </RollbarProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
