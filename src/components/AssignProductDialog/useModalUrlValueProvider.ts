import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { InitialProductAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { FilterContainer, FilterElement } from "../ConditionalFilter/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { TokenArray } from "../ConditionalFilter/ValueProvider/TokenArray";
import { FetchingParams } from "../ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";
import { useUrlFilterStore } from "./useUrlFilterStore";

export const useModalUrlValueProvider = (
  initialState?: InitialProductAPIState,
): FilterValueProvider => {
  const { state, updateFilters, clearFilters } = useUrlFilterStore();
  const [value, setValue] = useState<FilterContainer>([]);

  const tokenizedUrl = useMemo(
    () => new TokenArray(state.filterQueryString),
    [state.filterQueryString],
  );

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
    if (loading || !data) return;

    setValue(tokenizedUrl.asFilterValuesFromResponse(data));
  }, [data, loading, tokenizedUrl]);

  useEffect(() => {
    if (hasInitialState) return;

    setValue(tokenizedUrl.asFilterValueFromEmpty());
  }, [state.filterQueryString, hasInitialState, tokenizedUrl]);

  const persist = useCallback(
    (filterValue: FilterContainer): void => {
      const filterStructureParams = { ...prepareStructure(filterValue) } as Record<string, unknown>;

      updateFilters(filterStructureParams);
      setValue(filterValue);
    },
    [updateFilters],
  );

  const clear = useCallback((): void => {
    clearFilters();
    setValue([]);
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
  const loadingState = initialState?.loading || false;

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
