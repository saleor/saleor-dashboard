import React from "react";

import { FlagsmithProvider } from "./flagsmith/flagsmithProvider";

interface FeatureFlagsProviderProps {
  children: React.ReactElement;
}

export const FeatureFlagsProvider = ({
  children,
}: FeatureFlagsProviderProps) => {
  const isFeatureFlagsEnabled = process.env.FLAGS_SERVICE_ENABLED === "true";

  return (
    <FlagsmithProvider preventFetch={!isFeatureFlagsEnabled}>
      {children}
    </FlagsmithProvider>
  );
};
