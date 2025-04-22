import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="md:px-10 lg:px-20 mx-auto w-full px-6">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
