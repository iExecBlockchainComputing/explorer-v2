import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$chainSlug/_layout/$')({
  loader: () => {
    throw redirect({ to: '/' });
  },
  component: () => null,
});
