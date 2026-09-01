import { parseQs } from "@dashboard/url-utils";
import * as Sentry from "@sentry/react";
import { stringify } from "qs";
import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";

const isFilterKey = (key: string): boolean => /^\d+$/.test(key);

const stripLeadingQuestionMark = (search: string): string =>
  search.startsWith("?") ? search.slice(1) : search;

interface FilterUrlState {
  search: string;
  filterParams: Record<string, unknown>;
  preservedParams: Record<string, unknown>;
  filterQueryString: string;
}

/** Removes non-filter related query variables from queryString
 * this is used so that we can operate on filter state and leave other query variables unchanged */
const parseUrlSearch = (rawSearch: string): FilterUrlState => {
  const cleanSearch = stripLeadingQuestionMark(rawSearch);

  let parsed: Record<string, unknown>;

  try {
    parsed = parseQs(cleanSearch) as Record<string, unknown>;
  } catch {
    const errorMessage = "[useUrlFilterStore] Failed to parse URL search params, using empty state";

    Sentry.captureException(new Error(errorMessage));

    return {
      search: cleanSearch,
      filterParams: {},
      preservedParams: {},
      filterQueryString: "",
    };
  }

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

/** Handles filter value changes in URL for ConditionalFilter used in modals */
export const useUrlFilterStore = (): {
  state: FilterUrlState;
  updateFilters: (filterParams: Record<string, unknown>) => void;
  clearFilters: () => void;
} => {
  const history = useHistory();
  const { search: locationSearch } = useLocation();

  const state = useMemo(() => parseUrlSearch(locationSearch), [locationSearch]);

  // Read the live location from the history object instead of the per-render
  // useLocation() snapshot. These callbacks can run from stale closures
  // (e.g. unmount cleanup after the modal-closing navigation); replacing the
  // URL based on a stale snapshot would resurrect removed params such as
  // `action`, reopening the dialog that was just closed.
  const updateFilters = useCallback(
    (newFilterParams: Record<string, unknown>): void => {
      const { location } = history;
      const currentState = parseUrlSearch(location.search);

      history.replace({
        pathname: location.pathname,
        search: stringify({
          ...currentState.preservedParams,
          ...newFilterParams,
        }),
      });
    },
    [history],
  );

  const clearFilters = useCallback((): void => {
    const { location } = history;
    const currentState = parseUrlSearch(location.search);

    if (Object.keys(currentState.filterParams).length === 0) {
      return;
    }

    history.replace({
      pathname: location.pathname,
      search: stringify(currentState.preservedParams),
    });
  }, [history]);

  return {
    state,
    updateFilters,
    clearFilters,
  };
};
