import { createContext, useContext } from "react";

import { FlagList } from "./availableFlags";

const FeatureFlagsContext = createContext<FlagList | undefined>(undefined);

export const Provider = FeatureFlagsContext.Provider;

export const useFeatureFlagContext = () => {
  const context = useContext(FeatureFlagsContext);

  if (!context) {
    throw new Error("FeatureFlagsContext must be uset within its provider.");
  }

  return context;
};
