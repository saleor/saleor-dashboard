import React, { ReactNode, useState } from "react";

import { NavigatorContext } from "./useNavigatorContext";

export const NavigatorProvider = ({ children }: { children: ReactNode }) => {
  const [isNavigatorVisible, setNavigatorVisibility] = useState(false);

  return (
    <NavigatorContext.Provider
      value={{
        isNavigatorVisible,
        setNavigatorVisibility,
      }}
    >
      {children}
    </NavigatorContext.Provider>
  );
};
