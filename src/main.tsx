import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource-variable/anybody/wdth.css";
import "@fontsource-variable/mulish/index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { initQueryClient } from "./utils/initQueryClient.ts";
import {
  initRollbarAlerting,
  isRollbarActivated,
} from "./utils/initRollbarAlerting.ts";
import {
  ErrorBoundary as RollbarErrorBoundary,
  Provider as RollbarProvider,
} from "@rollbar/react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const { rollbar, rollbarConfig } = initRollbarAlerting();

const queryClient = initQueryClient({ rollbar });

// Render the app
const rootElement = document.getElementById("root")!;
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
    </StrictMode>,
  );
}
