import { ConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context/context";
import React, { FC } from "react";

import { useContainerState } from "./useContainerState";
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
