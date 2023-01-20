import flagsmith from "flagsmith";
import { FlagsmithProvider as Provider } from "flagsmith/react";
import React from "react";

interface FlagsServiceProviderProps {
  children: React.ReactElement;
}

export const FlagsServiceProvider = ({
  children,
}: FlagsServiceProviderProps) => {
  if (!FLAGS_SERVICE_ENABLED) {
    return children;
  }

  return (
    <Provider
      flagsmith={flagsmith}
      options={{
        environmentID: FLAGSMITH_ID,
        cacheFlags: true,
      }}
    >
      {children}
    </Provider>
  );
};
