import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Footer } from '@/components/Footer';
import { UnsupportedChain } from '@/components/UnsupportedChain';
import { Navbar } from '@/components/navbar/NavBar';
import { ChainSyncManager } from '@/hooks/ChainSyncManger';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="mx-auto mb-20 w-full px-4 md:px-10 lg:px-20">
      <ChainSyncManager />
      <Navbar />
      <UnsupportedChain />
      <Outlet />
      <Footer className="mt-32" />
      <TanStackRouterDevtools />
    </div>
  );
}
