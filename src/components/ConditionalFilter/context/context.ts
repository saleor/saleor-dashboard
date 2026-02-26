import { createContext } from "react";

import { type FilterAPIProvider } from "../API/FilterAPIProvider";
import { type QueryApiType } from "../FiltersQueryBuilder/types";
import { type FilterValueProvider } from "../FilterValueProvider";
import { type LeftOperandsProvider } from "../LeftOperandsProvider";
import { type useContainerState } from "../useContainerState";
import { type FilterWindow } from "../useFilterWindow";

export const ConditionalFilterContext = createContext<{
  apiProvider: FilterAPIProvider;
  valueProvider: FilterValueProvider;
  leftOperandsProvider: LeftOperandsProvider;
  containerState: ReturnType<typeof useContainerState>;
  filterWindow: FilterWindow;
  queryApiType: QueryApiType;
} | null>(null);
