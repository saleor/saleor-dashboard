import { type FilterAPIProvider } from "../ConditionalFilter/API/FilterAPIProvider";
import { type FilterContainer } from "../ConditionalFilter/FilterElement";
import { type QueryApiType } from "../ConditionalFilter/FiltersQueryBuilder/types";
import { type FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import {
  type LeftOperand,
  type LeftOperandsProvider,
} from "../ConditionalFilter/LeftOperandsProvider";
import { type FilterProviderType, type InitialResponseType } from "../ConditionalFilter/types";
import { type useContainerState } from "../ConditionalFilter/useContainerState";
import { type FilterWindow } from "../ConditionalFilter/useFilterWindow";

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
