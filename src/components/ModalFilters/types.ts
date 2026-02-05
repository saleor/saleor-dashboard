import { FilterAPIProvider } from "../ConditionalFilter/API/FilterAPIProvider";
import { FilterContainer } from "../ConditionalFilter/FilterElement";
import { QueryApiType } from "../ConditionalFilter/FiltersQueryBuilder/types";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { LeftOperand, LeftOperandsProvider } from "../ConditionalFilter/LeftOperandsProvider";
import { FilterProviderType, InitialResponseType } from "../ConditionalFilter/types";
import { useContainerState } from "../ConditionalFilter/useContainerState";
import { FilterWindow } from "../ConditionalFilter/useFilterWindow";

export interface LockedFilter {
  field: string;
  values: Array<{ id: string; name: string }>;
}

export interface ModalFilterResult<TQueryVariables> {
  filterContext: ModalFilterContext;
  filterVariables: TQueryVariables;
  filterChannel: string | undefined;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface ModalFilterContext {
  apiProvider: FilterAPIProvider;
  valueProvider: FilterValueProvider;
  leftOperandsProvider: LeftOperandsProvider;
  containerState: ReturnType<typeof useContainerState>;
  filterWindow: FilterWindow;
  queryApiType: QueryApiType;
}

export interface ModalFilterConfig<
  TQueryVariables,
  TFetchingParams,
  TInitialState extends InitialResponseType,
> {
  staticOptions: LeftOperand[];
  queryApiType: QueryApiType;
  lockedFilterField?: string;
  emptyFetchingParams: TFetchingParams;
  filterProviderType: FilterProviderType;
  createQueryVariables: (container: FilterContainer) => TQueryVariables & { channel?: string };
  useApiProvider: () => FilterAPIProvider;
  useInitialState: () => InitialStateAPI<TInitialState, TFetchingParams>;
}

export interface InitialStateAPI<TData, TFetchingParams> {
  data: TData;
  loading: boolean;
  fetchQueries: (params: TFetchingParams) => Promise<void>;
}
