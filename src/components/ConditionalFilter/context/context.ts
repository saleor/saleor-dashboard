import { createContext } from "react";

import { FilterAPIProvider } from "../API/FilterAPIProvider";
import { QueryApiType } from "../FiltersQueryBuilder/types";
import { FilterValueProvider } from "../FilterValueProvider";
import { LeftOperandsProvider } from "../LeftOperandsProvider";
import { ContainerState } from "../store/useContainerStateStore";
import { FilterWindow } from "../useFilterWindow";

export const ConditionalFilterContext = createContext<{
  apiProvider: FilterAPIProvider;
  valueProvider: FilterValueProvider;
  leftOperandsProvider: LeftOperandsProvider;
  containerState: ContainerState;
  filterWindow: FilterWindow;
  queryApiType: QueryApiType;
} | null>(null);
