import { CategoryFilterInput } from "@dashboard/graphql";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";

import { ConditionalFilterContext } from "../../ConditionalFilter/context/context";
import { ModalFilterResult } from "../types";
import { useModalFilters } from "../useModalFilters";
import { categoryFilterConfig } from "./categoryFilterConfig";

interface ModalCategoryFilterContextValue extends ModalFilterResult<CategoryFilterInput> {
  combinedFilters: {
    filter: CategoryFilterInput;
  };
}

const ModalCategoryFilterContext = createContext<ModalCategoryFilterContextValue | null>(null);

export interface ModalCategoryFilterProviderProps {
  children: ReactNode;
  excludedFilters?: string[];
}

export const ModalCategoryFilterProvider: FC<ModalCategoryFilterProviderProps> = ({
  children,
  excludedFilters,
}) => {
  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalFilters(categoryFilterConfig, { excludedFilters });

  const combinedFilters = useMemo(
    () => ({
      filter: filterVariables,
    }),
    [filterVariables],
  );

  return (
    <ConditionalFilterContext.Provider value={filterContext}>
      <ModalCategoryFilterContext.Provider
        value={{
          filterContext,
          filterVariables,
          filterChannel,
          combinedFilters,
          clearFilters,
          hasActiveFilters,
        }}
      >
        {children}
      </ModalCategoryFilterContext.Provider>
    </ConditionalFilterContext.Provider>
  );
};

export const useModalCategoryFilterContext = (): ModalCategoryFilterContextValue => {
  const context = useContext(ModalCategoryFilterContext);

  if (!context) {
    throw new Error(
      "useModalCategoryFilterContext must be used within ModalCategoryFilterProvider",
    );
  }

  return context;
};
