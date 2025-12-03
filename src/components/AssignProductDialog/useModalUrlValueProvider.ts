import { stringify } from "qs";
import { useEffect, useMemo, useState } from "react";
import useRouter from "use-react-router";

import { InitialProductAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { FilterContainer, FilterElement } from "../ConditionalFilter/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { TokenArray } from "../ConditionalFilter/ValueProvider/TokenArray";
import {
  FetchingParams,
  getEmptyFetchingPrams,
} from "../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";

/**
 * Helper to get preserved params from URL search string
 */
const getPreservedParams = (search: string) => {
  const params = new URLSearchParams(search);

  return {
    action: params.get("action"),
    id: params.get("id"),
    ids: params.getAll("ids"),
    activeTab: params.get("activeTab"),
    query: params.get("query"),
    before: params.get("before"),
    after: params.get("after"),
  };
};

/**
 * Helper to get filter-only params (removes non-filter params)
 */
const getFilterParams = (search: string) => {
  const params = new URLSearchParams(search);

  params.delete("asc");
  params.delete("sort");
  params.delete("activeTab");
  params.delete("query");
  params.delete("before");
  params.delete("after");
  params.delete("action");
  params.delete("id");
  params.delete("ids");

  return params;
};

/**
 * A modified URL value provider for modal contexts.
 * This preserves the `action` and `ids` URL params that control modal open state.
 * Reads URL directly from router instead of relying on prop threading.
 */
export const useModalUrlValueProvider = (
  initialState?: InitialProductAPIState,
): FilterValueProvider => {
  const router = useRouter();
  const [value, setValue] = useState<FilterContainer>([]);

  // Read location search directly from router (not from props)
  const locationSearch = router.location.search;

  const filterParams = useMemo(() => getFilterParams(locationSearch), [locationSearch]);
  const tokenizedUrl = useMemo(() => new TokenArray(filterParams.toString()), [filterParams]);
  const paramsFromType = getEmptyFetchingPrams("product");
  const fetchingParams = paramsFromType
    ? tokenizedUrl.getFetchingParams(paramsFromType, "product")
    : null;

  useEffect(() => {
    if (initialState) {
      initialState.fetchQueries(fetchingParams as FetchingParams);
    }
  }, [locationSearch]);

  useEffect(() => {
    if (!initialState) return;

    const { data, loading } = initialState;

    if (loading) return;

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [initialState?.data, initialState?.loading]);

  useEffect(() => {
    if (initialState) return;

    setValue(tokenizedUrl.asFilterValueFromEmpty());
  }, [locationSearch, tokenizedUrl, initialState]);

  const persist = (filterValue: FilterContainer) => {
    // Read preserved params from CURRENT URL (not the stale locationSearch prop)
    const currentSearch = router.location.search;
    const { action, id, ids, activeTab, query, before, after } = getPreservedParams(currentSearch);

    // Build preserved params object
    const preservedParams: Record<string, string | string[] | undefined> = {
      activeTab: activeTab || undefined,
      query: query || undefined,
      before: before || undefined,
      after: after || undefined,
      action: action || undefined,
      id: id || undefined,
    };

    // Handle ids array
    if (ids.length > 0) {
      preservedParams.ids = ids;
    }

    router.history.replace({
      pathname: router.location.pathname,
      search: stringify({
        ...prepareStructure(filterValue),
        ...preservedParams,
      }),
    });
    setValue(filterValue);
  };

  const clear = () => {
    // Read preserved params from CURRENT URL
    const currentSearch = router.location.search;
    const { action, id, ids } = getPreservedParams(currentSearch);

    // When clearing, preserve modal-related params
    const preservedParams: Record<string, string | string[] | undefined> = {
      action: action || undefined,
      id: id || undefined,
    };

    if (ids.length > 0) {
      preservedParams.ids = ids;
    }

    router.history.replace({
      pathname: router.location.pathname,
      search: stringify(preservedParams),
    });
    setValue([]);
  };

  const isPersisted = (element: FilterElement) => {
    return value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
  };

  const getTokenByName = (name: string) => {
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
