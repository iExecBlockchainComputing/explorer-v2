import { createFileRoute, redirect } from '@tanstack/react-router';
import { INITIAL_CHAIN } from '@/utils/chain.utils';

export const Route = createFileRoute('/')({
  loader: () => {
    return redirect({ to: INITIAL_CHAIN.slug });
  },
});
