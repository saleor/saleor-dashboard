import flagsmith from "flagsmith";
import { FlagsmithProvider as Provider } from "flagsmith/react";
import React from "react";

interface FlagsmithProviderProps {
  children: React.ReactElement;
}

export const FlagsmithProvider = ({ children }: FlagsmithProviderProps) => (
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
