import React, { ReactNode, useState } from "react";

import { NavigatorSearchContext } from "./useNavigatorSearchContext";

export const NavigatorSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isNavigatorVisible, setNavigatorVisibility] = useState(false);

  return (
    <NavigatorSearchContext.Provider
      value={{
        isNavigatorVisible,
        setNavigatorVisibility,
      }}
    >
      {children}
    </NavigatorSearchContext.Provider>
  );
};
