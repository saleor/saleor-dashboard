/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";

export interface AppListContextValues {
  activateApp: (appId: string) => void;
  deactivateApp: (appId: string) => void;
}

export const AppListContext = React.createContext<AppListContextValues>({
  activateApp: () => {},
  deactivateApp: () => {}
});

export const useAppListContext = () => {
  const context = React.useContext(AppListContext);

  if (!context) {
    throw new Error("useAppListContext must be used within a AppListContext");
  }

  return context;
};
