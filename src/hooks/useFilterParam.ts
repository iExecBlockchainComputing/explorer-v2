import { useSearch, useNavigate } from '@tanstack/react-router';

/**
 * Synchronize a string filter value with the URL search params.
 * Ensures the value is part of the allowedValues list; otherwise falls back to defaultValue.
 *
 * @param paramName Query string key to store the filter value under.
 * @param allowedValues List of allowed string values for the filter.
 * @param defaultValue Default value if none present or invalid.
 * @returns [currentValue, setValue]
 */
export function useFilterParam(
  paramName: string,
  allowedValues: string[],
  defaultValue: string
) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const rawValue = (search?.[paramName] as string | undefined) ?? defaultValue;
  const value = allowedValues.includes(rawValue) ? rawValue : defaultValue;

  const setValue = (newValue: string) => {
    if (!allowedValues.includes(newValue)) return; // ignore invalid values
    if (newValue !== value) {
      const nav: any = navigate;
      nav({
        search: (prev: any) => ({
          ...prev,
          [paramName]: newValue,
        }),
        replace: true,
        resetScroll: false,
      });
    }
  };

  return [value, setValue] as const;
}
