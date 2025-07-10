import { useSearch, useNavigate } from '@tanstack/react-router';

export function usePageParam(paramName: string, defaultValue = 1) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const page = Number(search?.[paramName]) || defaultValue;

  const setPage = (newPage: number) => {
    if (newPage !== page) {
      navigate({
        search: (prev) => ({
          ...prev,
          [paramName]: newPage,
        }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  return [page, setPage] as const;
}
