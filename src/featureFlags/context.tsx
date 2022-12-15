import React, { createContext, useContext } from "react";

import {
  FeatureFlagAdapter,
  FeatureFlagDetails,
  FeatureFlagsProviderProps,
} from "./types";

const featureFlagsContext = createContext<FeatureFlagAdapter | null>(null);

export const useFlag = (flagName: string): FeatureFlagDetails => {
  const ctx = useContext(featureFlagsContext);

  if (!ctx) {
    throw new Error(
      "FeatureFlagsContext: Can not use context without provider",
    );
  }

  return ctx.getFlagInfo(flagName);
};

export const FeatureFlagsProvider = ({
  adapter,
  children,
}: FeatureFlagsProviderProps) => (
  <featureFlagsContext.Provider value={adapter}>
    {children}
  </featureFlagsContext.Provider>
);
