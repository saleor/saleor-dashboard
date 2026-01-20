import { parseQs } from "@dashboard/url-utils";
import { stringify } from "qs";
import { useCallback, useMemo } from "react";
import useRouter from "use-react-router";

const isFilterKey = (key: string): boolean => /^\d+$/.test(key);

const stripLeadingQuestionMark = (search: string): string =>
  search.startsWith("?") ? search.slice(1) : search;

export interface FilterUrlState {
  search: string;
  filterParams: Record<string, unknown>;
  preservedParams: Record<string, unknown>;
  filterQueryString: string;
}

export const parseUrlSearch = (search: string): FilterUrlState => {
  const cleanSearch = stripLeadingQuestionMark(search);
  const parsed = parseQs(cleanSearch) as Record<string, unknown>;
  const filterParams: Record<string, unknown> = {};
  const preservedParams: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (isFilterKey(key)) {
      filterParams[key] = value;
    } else {
      preservedParams[key] = value;
    }
  }

  return {
    search: cleanSearch,
    filterParams,
    preservedParams,
    filterQueryString: stringify(filterParams),
  };
};

export const useUrlFilterStore = (): {
  state: FilterUrlState;
  updateFilters: (filterParams: Record<string, unknown>) => void;
  clearFilters: () => void;
} => {
  const router = useRouter();
  const locationSearch = router.location.search;

  const state = useMemo(() => parseUrlSearch(locationSearch), [locationSearch]);

  const updateFilters = useCallback(
    (newFilterParams: Record<string, unknown>): void => {
      const currentState = parseUrlSearch(router.location.search);

      router.history.replace({
        pathname: router.location.pathname,
        search: stringify({
          ...currentState.preservedParams,
          ...newFilterParams,
        }),
      });
    },
    [router],
  );

  const clearFilters = useCallback((): void => {
    const currentState = parseUrlSearch(router.location.search);

    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(currentState.preservedParams),
    });
  }, [router]);

  return {
    state,
    updateFilters,
    clearFilters,
  };
};
