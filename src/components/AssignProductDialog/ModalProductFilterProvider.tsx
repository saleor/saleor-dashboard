import { createContext, FC, ReactNode, useContext } from "react";

import { ConditionalFilterContext } from "../ConditionalFilter/context/context";
import { useModalProductFilter, UseModalProductFilterResult } from "./useModalProductFilter";

type ModalProductFilterContextValue = UseModalProductFilterResult;

const ModalProductFilterContext = createContext<ModalProductFilterContextValue | null>(null);

export interface ProductTypeConstraint {
  id: string;
  name: string;
}

export interface InitialConstraints {
  productTypes?: ProductTypeConstraint[]; // ProductType constraints from reference attribute
}

export interface ModalProductFilterProviderProps {
  children: ReactNode;
  excludedFilters?: string[];
  initialConstraints?: InitialConstraints;
}

export const ModalProductFilterProvider: FC<ModalProductFilterProviderProps> = ({
  children,
  excludedFilters,
  initialConstraints,
}) => {
  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalProductFilter({
      excludedFilters,
      initialConstraints,
    });

  return (
    <ConditionalFilterContext.Provider value={filterContext}>
      <ModalProductFilterContext.Provider
        value={{
          filterContext,
          filterVariables,
          filterChannel,
          clearFilters,
          hasActiveFilters,
        }}
      >
        {children}
      </ModalProductFilterContext.Provider>
    </ConditionalFilterContext.Provider>
  );
};

export const useModalProductFilterContext = (): ModalProductFilterContextValue => {
  const context = useContext(ModalProductFilterContext);

  if (!context) {
    throw new Error("useModalProductFilterContext must be used within ModalProductFilterProvider");
  }

  return context;
};
