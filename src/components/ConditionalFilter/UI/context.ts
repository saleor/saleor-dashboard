import { createContext, useContext } from "react";

import { FilterEventEmitter } from "./EventEmitter";

interface Context {
  emitter: FilterEventEmitter;
  actionButtonsDisabled: boolean;
}

export const FilterContext = createContext<Context | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("Filter context must be used within FilterContext.Provider");
  }

  return context;
};
