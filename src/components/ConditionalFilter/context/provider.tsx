import React, { FC } from "react";

import { useDiscountFilterAPIProvider } from "../API/DiscountFiltersAPIProvider";
import { useProductInitialAPIState } from "../API/initialState/useInitialAPIState";
import { useProductFilterAPIProvider } from "../API/ProductFilterAPIProvider";
import { STATIC_DISCOUNT_OPTIONS, STATIC_PRODUCT_OPTIONS } from "../constants";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useProductFilterAPIProvider();
  const initialState = useProductInitialAPIState();
  const valueProvider = useUrlValueProvider(locationSearch, initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_PRODUCT_OPTIONS);
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

export const ConditionalDiscountFilterProvider: FC<{
  locationSearch: string;
}> = ({ children, locationSearch }) => {
  const apiProvider = useDiscountFilterAPIProvider();
  const valueProvider = useUrlValueProvider(locationSearch);
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_DISCOUNT_OPTIONS);
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
