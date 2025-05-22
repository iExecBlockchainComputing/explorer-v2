import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useSyncChain } from '@/hooks/useSyncChain';

export const Route = createFileRoute('/$chainSlug/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  useSyncChain();

  return <Outlet />;
}
