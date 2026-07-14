import { useCallback, useMemo } from "react";

import { type FilterContainer } from "../ConditionalFilter/FilterElement";
import { type FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { getEditableFilterContainer } from "../ConditionalFilter/globalConstraints";
import { type InitialResponseType } from "../ConditionalFilter/types";
import { useContainerState } from "../ConditionalFilter/useContainerState";
import { useFilterLeftOperandsProvider } from "../ConditionalFilter/useFilterLeftOperands";
import { useFilterWindow } from "../ConditionalFilter/useFilterWindow";
import {
  createLockedFilterElement,
  createWrappedValueProvider,
  getFilteredOptions,
} from "./lockedFilters";
import {
  createOperandExclusionApiProvider,
  createOperandExclusionValueProvider,
  type OperandValueExclusions,
} from "./operandExclusions";
import {
  type InitialStateAPI,
  type LockedFilter,
  type ModalFilterConfig,
  type ModalFilterContext,
  type ModalFilterResult,
} from "./types";
import { useModalUrlValueProvider } from "./useModalUrlValueProvider";

export interface UseModalFiltersOptions {
  excludedFilters?: string[];
  lockedFilter?: LockedFilter;
  operandValueExclusions?: OperandValueExclusions;
}

export const useModalFilters = <
  TQueryVariables,
  TFetchingParams,
  TInitialState extends InitialResponseType,
>(
  config: ModalFilterConfig<TQueryVariables, TFetchingParams, TInitialState>,
  options: UseModalFiltersOptions = {},
): ModalFilterResult<TQueryVariables> => {
  const { excludedFilters, lockedFilter, operandValueExclusions } = options;

  // Apply exclusions and locked filter to options
  const filteredOptions = useMemo(
    () => getFilteredOptions(config.staticOptions, excludedFilters, lockedFilter),
    [config.staticOptions, excludedFilters, lockedFilter],
  );

  const baseApiProvider = config.useApiProvider();
  const apiProvider = useMemo(
    () => createOperandExclusionApiProvider(baseApiProvider, operandValueExclusions),
    [baseApiProvider, operandValueExclusions],
  );
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

    return createLockedFilterElement(lockedFilter, config.staticOptions);
  }, [lockedFilter, config.staticOptions]);

  // Wrap value provider with locked filter behavior
  const lockedValueProvider = useMemo(
    () => createWrappedValueProvider(valueProvider, lockedElement, config.lockedFilterField),
    [valueProvider, lockedElement, config.lockedFilterField],
  );
  const wrappedValueProvider = useMemo(
    () => createOperandExclusionValueProvider(lockedValueProvider, operandValueExclusions),
    [lockedValueProvider, operandValueExclusions],
  );

  const containerValueProvider = useMemo((): FilterValueProvider => {
    if (!lockedElement) {
      return wrappedValueProvider;
    }

    return {
      ...wrappedValueProvider,
      value: getEditableFilterContainer(wrappedValueProvider.value),
    };
  }, [wrappedValueProvider, lockedElement]);

  const containerState = useContainerState(containerValueProvider);

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

  const clearFilters = useCallback((): void => {
    wrappedValueProvider.clear();
    containerState.resetToProvider();
    filterWindow.setOpen(false);
  }, [wrappedValueProvider, containerState, filterWindow]);

  const hasActiveFilters = wrappedValueProvider.count > 0;

  return {
    filterContext,
    filterVariables,
    filterChannel,
    clearFilters,
    hasActiveFilters,
  };
};
