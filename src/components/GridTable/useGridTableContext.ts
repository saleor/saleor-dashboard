import React from "react";

import { GridTableOwnProps } from "./Root";

export const GridTableContext = React.createContext<GridTableOwnProps>({ striped: false });

export const useGridTableContext = (gridTableContext: React.Context<GridTableOwnProps>) => {
  const ctx = React.useContext(gridTableContext);

  if (!ctx) {
    throw new Error("Context is used outside GridTableContext provider");
  }

  return ctx;
};
