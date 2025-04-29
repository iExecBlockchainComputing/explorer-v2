import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { TopNavBar } from '@/components/navbar/TopNavBar';

export const Route = createRootRoute({
  component: () => (
    <div className="mx-auto mb-20 w-full px-6 md:px-10 lg:px-20">
      <TopNavBar />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
