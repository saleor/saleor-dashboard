import React, { FC } from "react";

import { useProductInitialAPIState } from "../API/initialState/useInitialAPIState";
import { useProductFilterAPIProvider } from "../API/ProductFilterAPIProvider";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";
import { getInitialContainerState } from "./initalContainerState";

export const ConditionalProductFilterProvider: FC = ({ children }) => {
  const apiProvider = useProductFilterAPIProvider();
  const initialState = useProductInitialAPIState();
  const valueProvider = useUrlValueProvider(initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider();
  const containerState = useContainerState(
    getInitialContainerState(valueProvider.value),
  );

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
