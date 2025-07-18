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

export function useTabParam(
  paramName: string,
  tabLabels: string[],
  defaultIndex = 0
) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const labelFromUrl = search?.[paramName];
  const tabIndex = labelFromUrl
    ? tabLabels.indexOf(labelFromUrl)
    : defaultIndex;
  const currentTab = tabIndex >= 0 ? tabIndex : defaultIndex;

  const setTab = (newTabIndex: number) => {
    const newLabel = tabLabels[newTabIndex];
    if (newLabel && newTabIndex !== currentTab) {
      navigate({
        search: (prev: any) => ({
          ...prev,
          [paramName]: newLabel,
        }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  return [currentTab, setTab] as const;
}
