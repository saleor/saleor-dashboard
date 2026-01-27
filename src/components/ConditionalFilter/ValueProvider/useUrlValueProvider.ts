import { stringify } from "qs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useRouter from "use-react-router";

import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { FilterProviderType, InitialAPIState } from "../types";
import { TokenArray } from "./TokenArray";
import { getEmptyFetchingPrams } from "./TokenArray/fetchingParams";
import { prepareStructure } from "./utils";

/*
 * Race condition fix for URL ↔ React state synchronization.
 *
 * Problem: Filter value has two sources:
 * 1. Rehydration: computed from URL params + fetched GraphQL data
 * 2. User action: when user selects a filter, we update URL and set value directly
 *
 * When user selects a filter:
 * - persist() calls router.history.replace() which changes the URL
 * - URL change causes tokenizedUrl/rehydratedValue to recompute
 * - But GraphQL data is stale (from before the selection)
 * - So rehydratedValue overwrites user's selection with old data
 *
 * Solution: UserOverride stores user's selection + URL snapshot.
 * When computing final value, we check if URL still matches the snapshot.
 * If yes → user just set this, use their value.
 * If no → URL changed externally, use rehydrated value.
 */
interface UserOverride {
  urlSnapshot: string;
  value: FilterContainer;
}

export const useUrlValueProvider = (
  locationSearch: string,
  type: FilterProviderType,
  initialState?: InitialAPIState,
): FilterValueProvider => {
  const router = useRouter();
  const params = new URLSearchParams(locationSearch);
  const [userOverride, setUserOverride] = useState<UserOverride | null>(null);
  const activeTab = params.get("activeTab");
  const query = params.get("query");
  const before = params.get("before");
  const after = params.get("after");

  params.delete("asc");
  params.delete("sort");
  params.delete("activeTab");
  params.delete("query");
  params.delete("before");
  params.delete("after");

  const filterQueryString = params.toString();
  const tokenizedUrl = useMemo(() => new TokenArray(filterQueryString), [filterQueryString]);
  const paramsFromType = getEmptyFetchingPrams(type);
  const fetchingParams = paramsFromType
    ? tokenizedUrl.getFetchingParams(paramsFromType, type)
    : null;

  const data = initialState?.data;
  const loading = initialState?.loading ?? false;

  // Store fetchQueries in a ref to avoid triggering useEffect when initialState changes
  // but the function reference is the same (common with hooks returning stable callbacks).
  // Type assertion needed because InitialAPIState is a union type where each variant
  // has fetchQueries accepting different params. The correlation between `type` and
  // `initialState` ensures the correct params are passed, but TS can't narrow the union.
  const fetchQueriesRef = useRef<((params: typeof fetchingParams) => Promise<void>) | null>(null);

  useEffect(() => {
    fetchQueriesRef.current = initialState?.fetchQueries as
      | ((params: typeof fetchingParams) => Promise<void>)
      | null;
  }, [initialState?.fetchQueries]);

  useEffect(() => {
    if (!fetchQueriesRef.current || !fetchingParams) return;

    fetchQueriesRef.current(fetchingParams);
  }, [fetchingParams]);

  const rehydratedValue = useMemo((): FilterContainer => {
    if (initialState) {
      if (loading || !data) {
        return [];
      }

      return tokenizedUrl.asFilterValuesFromResponse(data);
    }

    return tokenizedUrl.asFilterValueFromEmpty();
  }, [initialState, loading, data, tokenizedUrl]);

  const value = useMemo((): FilterContainer => {
    if (userOverride && userOverride.urlSnapshot === filterQueryString) {
      return userOverride.value;
    }

    return rehydratedValue;
  }, [userOverride, filterQueryString, rehydratedValue]);

  const persist = useCallback(
    (filterValue: FilterContainer) => {
      const newParams = {
        ...prepareStructure(filterValue),
        ...(activeTab ? { activeTab } : {}),
        ...(query ? { query } : {}),
        ...(before ? { before } : {}),
        ...(after ? { after } : {}),
      };

      router.history.replace({
        pathname: router.location.pathname,
        search: stringify(newParams),
      });

      const filterStructureParams = prepareStructure(filterValue);
      const newUrlSnapshot = Object.entries(filterStructureParams)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&");

      setUserOverride({
        urlSnapshot: newUrlSnapshot,
        value: filterValue,
      });
    },
    [router, activeTab, query, before, after],
  );

  const clear = useCallback(() => {
    router.history.replace({
      pathname: router.location.pathname,
    });
    setUserOverride({
      urlSnapshot: "",
      value: [],
    });
  }, [router]);

  const isPersisted = useCallback(
    (element: FilterElement) => {
      return value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
    },
    [value],
  );

  const getTokenByName = useCallback(
    (name: string) => {
      return tokenizedUrl.asFlatArray().find(token => token.name === name);
    },
    [tokenizedUrl],
  );

  const count = useMemo(() => value.filter(v => typeof v !== "string").length, [value]);

  return useMemo(
    () => ({
      value,
      loading: initialState?.loading || false,
      persist,
      clear,
      isPersisted,
      getTokenByName,
      count,
    }),
    [value, initialState?.loading, persist, clear, isPersisted, getTokenByName, count],
  );
};
