import { createContext } from "react";

import { FilterAPIProvider } from "../API/FilterAPIProvider";
import { FilterValueProvider } from "../FilterValueProvider";
import { LeftOperandsProvider } from "../LeftOperandsProvider";

export const ConditionalFilterContext = createContext<{
  apiProvider: FilterAPIProvider;
  valueProvider: FilterValueProvider;
  leftOperandsProvider: LeftOperandsProvider;
} | null>(null);
