import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="mx-auto w-full px-6 md:px-10 lg:px-20">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
