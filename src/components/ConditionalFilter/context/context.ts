import { createContext } from "react";

import { FilterAPIProvider } from "../API/FilterAPIProvider";
import { FilterValueProvider } from "../FilterValueProvider";
import { LeftOperandsProvider } from "../LeftOperandsProvider";
import { useContainerState } from "../useContainerState";

export const ConditionalFilterContext = createContext<{
  apiProvider: FilterAPIProvider;
  valueProvider: FilterValueProvider;
  leftOperandsProvider: LeftOperandsProvider;
  containerState: ReturnType<typeof useContainerState>;
} | null>(null);
