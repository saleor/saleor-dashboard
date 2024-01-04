import { ConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context/context";
import { useContainerState } from "@dashboard/components/ConditionalFilter/useContainerState";
import React, { FC } from "react";

import { useDiscountFilterAPIProvider } from "./useDiscountFilterAPIProvider";
import { useFilterLeftOperandsProvider } from "./useFilterLeftOperandsProvider";
import { useUrlValueProvider } from "./useUrlValueProvider";

export const ConditionalDiscountFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useDiscountFilterAPIProvider();
  const valueProvider = useUrlValueProvider(locationSearch);
  const leftOperandsProvider = useFilterLeftOperandsProvider();
  const containerState = useContainerState(valueProvider);

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
