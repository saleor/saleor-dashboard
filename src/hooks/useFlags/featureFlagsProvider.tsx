import React from "react";

import { FlagsmithProvider } from "./flagsmith/flagsmithProvider";

interface FeatureFlagsProviderProps {
  children: React.ReactElement;
}

export const FeatureFlagsProvider = ({
  children,
}: FeatureFlagsProviderProps) => {
  if (!FLAGS_SERVICE_ENABLED) {
    return children;
  }

  return <FlagsmithProvider>{children}</FlagsmithProvider>;
};
