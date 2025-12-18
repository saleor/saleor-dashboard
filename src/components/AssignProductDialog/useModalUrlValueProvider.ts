import { parseQs } from "@dashboard/url-utils";
import { stringify } from "qs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useRouter from "use-react-router";

import { InitialProductAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { FilterContainer, FilterElement } from "../ConditionalFilter/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { TokenArray } from "../ConditionalFilter/ValueProvider/TokenArray";
import { FetchingParams } from "../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";

const isFilterKey = (key: string): boolean => /^\d+$/.test(key);

const stripLeadingQuestionMark = (search: string): string =>
  search.startsWith("?") ? search.slice(1) : search;

const splitSearchIntoFilterAndPreserved = (
  search: string,
): { filterParams: Record<string, unknown>; preservedParams: Record<string, unknown> } => {
  const parsed = parseQs(stripLeadingQuestionMark(search)) as Record<string, unknown>;
  const filterParams: Record<string, unknown> = {};
  const preservedParams: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (isFilterKey(key)) {
      filterParams[key] = value;
    } else {
      preservedParams[key] = value;
    }
  }

  return { filterParams, preservedParams };
};

/**
 * A modified URL value provider for modal contexts.
 * This preserves the `action` and `ids` URL params that control modal open state.
 * Reads URL directly from router instead of relying on prop-drilling
 */
export const useModalUrlValueProvider = (
  initialState?: InitialProductAPIState,
): FilterValueProvider => {
  const router = useRouter();
  const [value, setValue] = useState<FilterContainer>([]);

  const locationSearch = router.location.search;
  const { filterParams } = useMemo(
    () => splitSearchIntoFilterAndPreserved(locationSearch),
    [locationSearch],
  );
  const filterQueryString = useMemo(() => stringify(filterParams), [filterParams]);
  const tokenizedUrl = useMemo(() => new TokenArray(filterQueryString), [filterQueryString]);

  // Ref to read latest tokenizedUrl without triggering effect re-runs
  // This prevents double-execution when URL changes (once for URL, once for data)
  const tokenizedUrlRef = useRef(tokenizedUrl);

  useEffect(() => {
    tokenizedUrlRef.current = tokenizedUrl;
  }, [tokenizedUrl]);

  const fetchingParams = useMemo(() => {
    const paramsFromType: FetchingParams = {
      category: [],
      collection: [],
      channel: [],
      productType: [],
      attribute: {},
      attributeReference: {},
    };

    return tokenizedUrl.getFetchingParams(paramsFromType, "product") as FetchingParams;
  }, [tokenizedUrl]);

  const fetchQueriesRef = useRef<InitialProductAPIState["fetchQueries"] | undefined>(
    initialState?.fetchQueries,
  );
  const hasInitialState = Boolean(initialState);
  const data = initialState?.data;
  const loading = initialState?.loading || false;

  useEffect(() => {
    fetchQueriesRef.current = initialState?.fetchQueries;
  }, [initialState?.fetchQueries]);

  useEffect(() => {
    if (!fetchQueriesRef.current) return;

    fetchQueriesRef.current(fetchingParams);
  }, [fetchingParams]);

  useEffect(() => {
    if (loading) return;

    if (!data) return;

    // Use ref to read current tokenizedUrl without making it a dependency
    // This prevents double-execution when URL changes (once for URL, once for data)
    setValue(tokenizedUrlRef.current.asFilterValuesFromResponse(data));
  }, [data, loading]);

  useEffect(() => {
    if (hasInitialState) return;

    // When no initialState, we immediately populate from URL
    setValue(tokenizedUrlRef.current.asFilterValueFromEmpty());
  }, [locationSearch, hasInitialState]);

  const persist = useCallback(
    (filterValue: FilterContainer): void => {
      const currentSearch = router.location.search;
      const { preservedParams } = splitSearchIntoFilterAndPreserved(currentSearch);
      const filterStructureParams = { ...prepareStructure(filterValue) } as Record<string, unknown>;

      router.history.replace({
        pathname: router.location.pathname,
        search: stringify({
          ...preservedParams,
          ...filterStructureParams,
        }),
      });
      setValue(filterValue);
    },
    [router],
  );

  const clear = useCallback((): void => {
    const currentSearch = router.location.search;
    const { preservedParams } = splitSearchIntoFilterAndPreserved(currentSearch);

    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(preservedParams),
    });
    setValue([]);
  }, [router]);

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
  const loadingState = initialState?.loading || false;

  // Memoize the returned object to prevent unnecessary re-renders
  // This is critical when using wrapped providers (e.g., with constraints)
  // because a new object reference would cause the wrapper to recreate,
  // e.g. triggering useEffect resets in useContainerState
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
