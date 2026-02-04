import { createContext, ReactNode, useContext } from "react";

import { ConditionalFilterContext } from "../ConditionalFilter/context/context";
import { InitialResponseType } from "../ConditionalFilter/types";
import { LockedFilter, ModalFilterConfig, ModalFilterResult } from "./types";
import { useModalFilters } from "./useModalFilters";

interface ModalFiltersProviderProps<
  TQueryVariables,
  TFetchingParams,
  TInitialState extends InitialResponseType,
> {
  children: ReactNode;
  config: ModalFilterConfig<TQueryVariables, TFetchingParams, TInitialState>;
  excludedFilters?: string[];
  lockedFilter?: LockedFilter;
}

const ModalFiltersContext = createContext<ModalFilterResult<unknown> | null>(null);

export function ModalFiltersProvider<
  TQueryVariables,
  TFetchingParams,
  TInitialState extends InitialResponseType,
>({
  children,
  config,
  excludedFilters,
  lockedFilter,
}: ModalFiltersProviderProps<TQueryVariables, TFetchingParams, TInitialState>): JSX.Element {
  const result = useModalFilters(config, { excludedFilters, lockedFilter });

  return (
    <ConditionalFilterContext.Provider value={result.filterContext}>
      <ModalFiltersContext.Provider value={result as ModalFilterResult<unknown>}>
        {children}
      </ModalFiltersContext.Provider>
    </ConditionalFilterContext.Provider>
  );
}

export function useModalFiltersContext<TQueryVariables>(): ModalFilterResult<TQueryVariables> {
  const context = useContext(ModalFiltersContext);

  if (!context) {
    throw new Error("useModalFiltersContext must be used within ModalFiltersProvider");
  }

  return context as ModalFilterResult<TQueryVariables>;
}
