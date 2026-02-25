import { type CollectionFilterInput } from "@dashboard/graphql";
import { createContext, type FC, type ReactNode, useContext, useMemo } from "react";

import { ConditionalFilterContext } from "../../ConditionalFilter/context/context";
import { type ModalFilterResult } from "../types";
import { useModalFilters } from "../useModalFilters";
import { collectionFilterConfig } from "./collectionFilterConfig";

interface ModalCollectionFilterContextValue
  extends ModalFilterResult<{ filter: CollectionFilterInput; channel: string | undefined }> {
  combinedFilters: {
    filter: CollectionFilterInput;
    channel: string | undefined;
  };
}

const ModalCollectionFilterContext = createContext<ModalCollectionFilterContextValue | null>(null);

export interface ModalCollectionFilterProviderProps {
  children: ReactNode;
  excludedFilters?: string[];
}

export const ModalCollectionFilterProvider: FC<ModalCollectionFilterProviderProps> = ({
  children,
  excludedFilters,
}) => {
  const { filterContext, filterVariables, filterChannel, clearFilters, hasActiveFilters } =
    useModalFilters(collectionFilterConfig, { excludedFilters });

  const combinedFilters = useMemo(
    () => ({
      filter: filterVariables.filter,
      channel: filterChannel,
    }),
    [filterVariables, filterChannel],
  );

  return (
    <ConditionalFilterContext.Provider value={filterContext}>
      <ModalCollectionFilterContext.Provider
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
      </ModalCollectionFilterContext.Provider>
    </ConditionalFilterContext.Provider>
  );
};

export const useModalCollectionFilterContext = (): ModalCollectionFilterContextValue => {
  const context = useContext(ModalCollectionFilterContext);

  if (!context) {
    throw new Error(
      "useModalCollectionFilterContext must be used within ModalCollectionFilterProvider",
    );
  }

  return context;
};
