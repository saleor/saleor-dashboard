import { useMemo } from "react";

import { FilterContainer } from "../ConditionalFilter/FilterElement";
import { InitialResponseType } from "../ConditionalFilter/types";
import { useContainerState } from "../ConditionalFilter/useContainerState";
import { useFilterLeftOperandsProvider } from "../ConditionalFilter/useFilterLeftOperands";
import { useFilterWindow } from "../ConditionalFilter/useFilterWindow";
import {
  createLockedFilterElement,
  createWrappedValueProvider,
  getFilteredOptions,
} from "./lockedFilters";
import {
  InitialStateAPI,
  LockedFilter,
  ModalFilterConfig,
  ModalFilterContext,
  ModalFilterResult,
} from "./types";
import { useModalUrlValueProvider } from "./useModalUrlValueProvider";

export interface UseModalFiltersOptions {
  excludedFilters?: string[];
  lockedFilter?: LockedFilter;
}

export const useModalFilters = <
  TQueryVariables,
  TFetchingParams,
  TInitialState extends InitialResponseType,
>(
  config: ModalFilterConfig<TQueryVariables, TFetchingParams, TInitialState>,
  options: UseModalFiltersOptions = {},
): ModalFilterResult<TQueryVariables> => {
  const { excludedFilters, lockedFilter } = options;

  // Apply exclusions and locked filter to options
  const filteredOptions = useMemo(
    () => getFilteredOptions(config.staticOptions, excludedFilters, lockedFilter),
    [config.staticOptions, excludedFilters, lockedFilter],
  );

  const apiProvider = config.useApiProvider();
  const initialState = config.useInitialState() as InitialStateAPI<TInitialState, TFetchingParams>;
  const leftOperandsProvider = useFilterLeftOperandsProvider(filteredOptions);
  const filterWindow = useFilterWindow();

  const valueProvider = useModalUrlValueProvider(
    initialState,
    config.emptyFetchingParams,
    config.filterProviderType,
  );

  const lockedElement = useMemo(() => {
    if (!lockedFilter) {
      return null;
    }

    return createLockedFilterElement(lockedFilter);
  }, [lockedFilter]);

  // Wrap value provider with locked filter behavior
  const wrappedValueProvider = useMemo(
    () => createWrappedValueProvider(valueProvider, lockedElement, config.lockedFilterField),
    [valueProvider, lockedElement, config.lockedFilterField],
  );

  const containerState = useContainerState(wrappedValueProvider);

  const filterContext: ModalFilterContext = useMemo(
    () => ({
      apiProvider,
      valueProvider: wrappedValueProvider,
      leftOperandsProvider,
      containerState,
      filterWindow,
      queryApiType: config.queryApiType,
    }),
    [apiProvider, wrappedValueProvider, leftOperandsProvider, containerState, filterWindow, config],
  );

  const { filterVariables, filterChannel } = useMemo(() => {
    const queryVars = config.createQueryVariables(
      wrappedValueProvider.value as FilterContainer,
    ) as TQueryVariables & { channel?: string };
    const { channel, ...where } = queryVars;

    return {
      filterVariables: where as TQueryVariables,
      filterChannel: channel,
    };
  }, [wrappedValueProvider.value, config]);

  const clearFilters = (): void => {
    wrappedValueProvider.clear();
    containerState.clear();
  };

  const hasActiveFilters = wrappedValueProvider.count > 0;

  return {
    filterContext,
    filterVariables,
    filterChannel,
    clearFilters,
    hasActiveFilters,
  };
};
