import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/$chainSlug/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
