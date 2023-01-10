import flagsmith from "flagsmith";
import { FlagsmithProvider as Provider } from "flagsmith/react";
import React from "react";

export const FlagsmithProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => (
  <Provider
    flagsmith={flagsmith}
    options={{
      environmentID: process.env.FLAGS_SERVICE_ENABLED,
      cacheFlags: true,
    }}
  >
    {children}
  </Provider>
);
