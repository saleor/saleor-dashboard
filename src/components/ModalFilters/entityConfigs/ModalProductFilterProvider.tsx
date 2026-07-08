import { type ProductWhereInput } from "@dashboard/graphql";
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { ConditionalFilterContext } from "../../ConditionalFilter/context/context";
import { createOperandValueExclusions } from "../operandExclusions";
import { type LockedFilter, type ModalFilterResult } from "../types";
import { useModalFilters } from "../useModalFilters";
import { productFilterConfig } from "./productFilterConfig";

export interface ProductTypeConstraint {
  id: string;
  name: string;
}

export interface CollectionConstraint {
  id: string;
  name: string;
}

export interface InitialConstraints {
  productTypes?: ProductTypeConstraint[];
  excludeCollections?: CollectionConstraint[];
}

interface ModalProductFilterContextValue extends ModalFilterResult<ProductWhereInput> {
  combinedFilters: {
    where: ProductWhereInput;
    channel: string | undefined;
  };
}

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

  const operandValueExclusions = useMemo(
    () => createOperandValueExclusions(initialConstraints?.excludeCollections),
    [initialConstraints?.excludeCollections],
  );

  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalFilters(productFilterConfig, {
      excludedFilters,
      lockedFilter,
      operandValueExclusions,
    });

  const combinedFilters = useMemo(
    () => ({
      where: filterVariables,
      channel: filterChannel,
    }),
    [filterVariables, filterChannel],
  );

  const clearFiltersRef = useRef(clearFilters);

  clearFiltersRef.current = clearFilters;

  useEffect(() => {
    return () => {
      clearFiltersRef.current();
    };
  }, []);

  return (
    <ConditionalFilterContext.Provider value={filterContext}>
      <ModalProductFilterContext.Provider
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
