import { type PageWhereInput } from "@dashboard/graphql";
import { createContext, type FC, type ReactNode, useContext, useMemo } from "react";

import { ConditionalFilterContext } from "../../ConditionalFilter/context/context";
import { type LockedFilter, type ModalFilterResult } from "../types";
import { useModalFilters } from "../useModalFilters";
import { pageFilterConfig } from "./pageFilterConfig";

export interface PageTypeConstraint {
  id: string;
  name: string;
}

export interface InitialPageConstraints {
  pageTypes?: PageTypeConstraint[];
}

interface ModalPageFilterContextValue extends ModalFilterResult<PageWhereInput> {
  combinedFilters: {
    where: PageWhereInput;
  };
}

const ModalPageFilterContext = createContext<ModalPageFilterContextValue | null>(null);

export interface ModalPageFilterProviderProps {
  children: ReactNode;
  excludedFilters?: string[];
  initialConstraints?: InitialPageConstraints;
}

export const ModalPageFilterProvider: FC<ModalPageFilterProviderProps> = ({
  children,
  excludedFilters,
  initialConstraints,
}) => {
  const lockedFilter: LockedFilter | undefined = useMemo(() => {
    if (!initialConstraints?.pageTypes?.length) {
      return undefined;
    }

    return {
      field: "pageTypes",
      values: initialConstraints.pageTypes,
    };
  }, [initialConstraints?.pageTypes]);

  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalFilters(pageFilterConfig, {
      excludedFilters,
      lockedFilter,
    });

  const combinedFilters = useMemo(
    () => ({
      where: filterVariables,
    }),
    [filterVariables],
  );

  return (
    <ConditionalFilterContext.Provider value={filterContext}>
      <ModalPageFilterContext.Provider
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
      </ModalPageFilterContext.Provider>
    </ConditionalFilterContext.Provider>
  );
};

export const useModalPageFilterContext = (): ModalPageFilterContextValue => {
  const context = useContext(ModalPageFilterContext);

  if (!context) {
    throw new Error("useModalPageFilterContext must be used within ModalPageFilterProvider");
  }

  return context;
};
