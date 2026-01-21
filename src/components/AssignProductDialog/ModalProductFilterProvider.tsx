import { ProductWhereInput } from "@dashboard/graphql";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";

import { ConditionalFilterContext } from "../ConditionalFilter/context/context";
import { productFilterConfig } from "../ModalFilters/entityConfigs";
import { LockedFilter, ModalFilterResult } from "../ModalFilters/types";
import { useModalFilters } from "../ModalFilters/useModalFilters";

export interface ProductTypeConstraint {
  id: string;
  name: string;
}

export interface InitialConstraints {
  productTypes?: ProductTypeConstraint[];
}

type ModalProductFilterContextValue = ModalFilterResult<ProductWhereInput>;

const ModalProductFilterContext = createContext<ModalProductFilterContextValue | null>(null);

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
  const lockedFilter: LockedFilter | undefined = useMemo(() => {
    if (!initialConstraints?.productTypes?.length) {
      return undefined;
    }

    return {
      field: "productType",
      values: initialConstraints.productTypes,
    };
  }, [initialConstraints?.productTypes]);

  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalFilters(productFilterConfig, {
      excludedFilters,
      lockedFilter,
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
