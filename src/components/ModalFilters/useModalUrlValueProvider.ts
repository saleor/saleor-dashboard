import { stringify } from "qs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FilterContainer, FilterElement } from "../ConditionalFilter/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { FilterProviderType, InitialResponseType } from "../ConditionalFilter/types";
import { TokenArray } from "../ConditionalFilter/ValueProvider/TokenArray";
import { FetchingParamsType } from "../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";
import { InitialStateAPI } from "./types";
import { useUrlFilterStore } from "./useUrlFilterStore";

/*
 * Race condition fix for URL ↔ React state synchronization.
 *
 * Problem: Filter value has two sources:
 * 1. Rehydration: computed from URL params + fetched GraphQL data
 * 2. User action: when user selects a filter, we update URL and set value directly
 *
 * When user selects a filter:
 * - We call updateFilters() which changes the URL
 * - URL change causes rehydratedValue to recompute
 * - But GraphQL data is stale (from before the selection)
 * - So rehydratedValue overwrites user's selection with old data
 *
 * The original useUrlValueProvider has the same issue but works around it by
 * disabling eslint-disable react-hooks/exhaustive-deps and omitting tokenizedUrl
 * from effect dependencies. We solve it properly with derived state instead.
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

export const useModalUrlValueProvider = <
  TInitialState extends InitialResponseType,
  TFetchingParams,
>(
  initialState: InitialStateAPI<TInitialState, TFetchingParams> | undefined,
  emptyFetchingParams: TFetchingParams,
  filterProviderType: FilterProviderType,
): FilterValueProvider => {
  const { state, updateFilters, clearFilters } = useUrlFilterStore();
  const [userOverride, setUserOverride] = useState<UserOverride | null>(null);

  const tokenizedUrl = useMemo(
    () => new TokenArray(state.filterQueryString),
    [state.filterQueryString],
  );

  const fetchingParams = useMemo(
    () =>
      tokenizedUrl.getFetchingParams(
        emptyFetchingParams as FetchingParamsType,
        filterProviderType,
      ) as TFetchingParams,
    [tokenizedUrl, emptyFetchingParams, filterProviderType],
  );

  const fetchQueriesRef = useRef<InitialStateAPI<TInitialState, TFetchingParams>["fetchQueries"]>();
  const hasInitialState = Boolean(initialState);
  const data = initialState?.data;
  const loading = initialState?.loading ?? false;

  useEffect(() => {
    fetchQueriesRef.current = initialState?.fetchQueries;
  }, [initialState?.fetchQueries]);

  useEffect(() => {
    if (!fetchQueriesRef.current) return;

    fetchQueriesRef.current(fetchingParams);
  }, [fetchingParams]);

  const rehydratedValue = useMemo((): FilterContainer => {
    if (hasInitialState) {
      if (loading || !data) {
        return [];
      }

      return tokenizedUrl.asFilterValuesFromResponse(data as InitialResponseType);
    }

    return tokenizedUrl.asFilterValueFromEmpty();
  }, [hasInitialState, loading, data, tokenizedUrl]);

  const value = useMemo((): FilterContainer => {
    if (userOverride && userOverride.urlSnapshot === state.filterQueryString) {
      return userOverride.value;
    }

    return rehydratedValue;
  }, [userOverride, state.filterQueryString, rehydratedValue]);

  const persist = useCallback(
    (filterValue: FilterContainer): void => {
      const filterStructureParams = { ...prepareStructure(filterValue) } as Record<string, unknown>;

      updateFilters(filterStructureParams);

      setUserOverride({
        urlSnapshot: stringify(filterStructureParams),
        value: filterValue,
      });
    },
    [updateFilters],
  );

  const clear = useCallback((): void => {
    clearFilters();
    setUserOverride({
      urlSnapshot: "",
      value: [],
    });
  }, [clearFilters]);

  const isPersisted = useCallback(
    (element: FilterElement): boolean => {
      return value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
    },
    [value],
  );

  const getTokenByName = useCallback(
    (name: string): UrlToken | undefined => {
      return tokenizedUrl.asFlatArray().find(token => token.name === name);
    },
    [tokenizedUrl],
  );

  const count = useMemo(() => value.filter(v => typeof v !== "string").length, [value]);
  const loadingState = initialState?.loading ?? false;

  return useMemo(
    () => ({
      value,
      loading: loadingState,
      persist,
      clear,
      isPersisted,
      getTokenByName,
      count,
    }),
    [value, loadingState, persist, clear, isPersisted, getTokenByName, count],
  );
};
