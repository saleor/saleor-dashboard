import React, { FC } from "react";

import {
  useInitialState,
  useProductFilterAPIProvider,
} from "../API/ProductFilterAPIProvider";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductFilterProvider: FC = ({ children }) => {
  const apiProvider = useProductFilterAPIProvider();
  const initalState = useInitialState();
  const valueProvider = useUrlValueProvider(initalState);
  const leftOperandsProvider = useFilterLeftOperandsProvider();
  const { value, updateAt, removeAt, createEmpty } = useContainerState(
    valueProvider.value,
  );

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        state: {
          value,
          updateAt,
          removeAt,
          createEmpty,
        },
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
