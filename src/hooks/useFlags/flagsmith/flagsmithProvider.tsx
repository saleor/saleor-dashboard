import flagsmith from "flagsmith";
import { FlagsmithProvider as Provider } from "flagsmith/react";
import React from "react";

interface FlagsmithProviderProps {
  children: React.ReactElement;
  preventFetch: boolean;
}

export const FlagsmithProvider = ({
  children,
  preventFetch,
}: FlagsmithProviderProps) => (
  <Provider
    flagsmith={flagsmith}
    options={{
      preventFetch,
      environmentID: process.env.FLAGSMITH_ID,
      cacheFlags: true,
    }}
  >
    {children}
  </Provider>
);
