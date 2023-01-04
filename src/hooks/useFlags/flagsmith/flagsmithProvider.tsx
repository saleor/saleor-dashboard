import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

export const Provider = ({ children }: { children: React.ReactElement }) => (
  <FlagsmithProvider
    flagsmith={flagsmith}
    options={{
      environmentID: process.env.FLAGSMITH_ID,
      cacheFlags: true,
    }}
  >
    {children}
  </FlagsmithProvider>
);
