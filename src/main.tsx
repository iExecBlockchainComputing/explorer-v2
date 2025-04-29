import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/mulish/index.css';
import {
  ErrorBoundary as RollbarErrorBoundary,
  Provider as RollbarProvider,
} from '@rollbar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import './index.css';
import { initRouter } from './initRouter.ts';
import { initQueryClient } from './utils/initQueryClient.ts';
import {
  initRollbarAlerting,
  isRollbarActivated,
} from './utils/initRollbarAlerting.ts';
import { wagmiAdapter } from './utils/wagmiConfig.ts';

const { rollbar, rollbarConfig } = initRollbarAlerting();

const queryClient = initQueryClient({ rollbar });

const router = initRouter(queryClient);

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RollbarProvider
            config={isRollbarActivated ? rollbarConfig : undefined}
          >
            <RollbarErrorBoundary>
              <RouterProvider router={router} />
            </RollbarErrorBoundary>
          </RollbarProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
