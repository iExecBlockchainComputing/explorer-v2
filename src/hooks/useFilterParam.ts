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

  const rawCandidate =
    search && Object.prototype.hasOwnProperty.call(search, paramName)
      ? (search as Record<string, unknown>)[paramName]
      : undefined;

  const value =
    typeof rawCandidate === 'string' && allowedValues.includes(rawCandidate)
      ? rawCandidate
      : defaultValue;

  const setValue = (newValue: string) => {
    if (!allowedValues.includes(newValue)) return; // ignore invalid values
    if (newValue !== value) {
      navigate({
        search: (prev) => ({
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
