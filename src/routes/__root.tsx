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
    <div className="mx-auto flex min-h-screen w-full flex-col px-4 md:px-10 lg:px-20">
      <ChainSyncManager />
      <Navbar />
      <UnsupportedChain />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer className="mt-32 mb-10 justify-end" />
      <TanStackRouterDevtools />
    </div>
  );
}
