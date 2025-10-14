import { ClerkProvider } from '@clerk/clerk-react';
import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/mulish/index.css';
import {
  ErrorBoundary as RollbarErrorBoundary,
  Provider as RollbarProvider,
} from '@rollbar/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from './components/themeProvider.tsx';
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
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}
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
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                  <RouterProvider router={router} />
                </ClerkProvider>
              </ThemeProvider>
            </RollbarErrorBoundary>
          </RollbarProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
