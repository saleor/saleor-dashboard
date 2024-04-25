/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";

export interface AppListContextValues {
  removeAppInstallation: (installationId: string) => void;
  retryAppInstallation: (installationId: string) => void;
}

export const AppListContext = React.createContext<AppListContextValues | undefined>(undefined);

export const useAppListContext = () => {
  const context = React.useContext(AppListContext);

  if (!context) {
    throw new Error("useAppListContext must be used within a AppListContext");
  }

  return context;
};
