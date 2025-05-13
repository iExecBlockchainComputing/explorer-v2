import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Footer } from '@/components/Footer';
import { UnsupportedChain } from '@/components/UnsupportedChain';
import { Navbar } from '@/components/navbar/NavBar';
import { useSyncAccountWithUserStore } from '@/hooks/useSyncAccountWithUserStore';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useSyncAccountWithUserStore();

  return (
    <div className="mx-auto mb-20 w-full px-6 md:px-10 lg:px-20">
      <Navbar />
      <UnsupportedChain />
      <Outlet />
      <Footer className="mt-32" />
      <TanStackRouterDevtools />
    </div>
  );
}
