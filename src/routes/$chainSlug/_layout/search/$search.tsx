import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$chainSlug/_layout/search/$search')({
  loader: ({ params }) => {
    const { chainSlug, search } = params;

    return redirect({
      to: `/${chainSlug}?search=${encodeURIComponent(search)}`,
      replace: true,
    });
  },
});
