import { parseQs } from "@dashboard/url-utils";
import { stringify } from "qs";
import { useEffect, useMemo, useRef, useState } from "react";
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

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [data, loading, tokenizedUrl]);

  useEffect(() => {
    if (hasInitialState) return;

    setValue(tokenizedUrl.asFilterValueFromEmpty());
  }, [hasInitialState, tokenizedUrl]);

  const persist = (filterValue: FilterContainer): void => {
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
  };

  const clear = (): void => {
    const currentSearch = router.location.search;
    const { preservedParams } = splitSearchIntoFilterAndPreserved(currentSearch);

    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(preservedParams),
    });
    setValue([]);
  };

  const isPersisted = (element: FilterElement): boolean => {
    return value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
  };

  const getTokenByName = (name: string): UrlToken | undefined => {
    return tokenizedUrl.asFlatArray().find(token => token.name === name);
  };

  const count = value.filter(v => typeof v !== "string").length;

  return {
    value,
    loading: initialState?.loading || false,
    persist,
    clear,
    isPersisted,
    getTokenByName,
    count,
  };
};
