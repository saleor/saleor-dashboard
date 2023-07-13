import React, { FC } from "react";

import { useProductFilterAPIProvider } from "../API/ProductFilterAPIProvider";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useUrlValueProvider } from "../ValueProvider/useUrlValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductFilterProvider: FC = ({ children }) => {
  const apiProvider = useProductFilterAPIProvider();
  const valueProvider = useUrlValueProvider(apiProvider);
  const leftOperandsProvider = useFilterLeftOperandsProvider();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
