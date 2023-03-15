import React, { useState } from "react";

import { DevModeContext } from "./hooks";

export function DevModeProvider({ children }) {
  const [variables, setVariables] = useState("");
  const [devModeContent, setDevModeContent] = useState("");
  const [isDevModeVisible, setDevModeVisibility] = useState(false);

  return (
    <DevModeContext.Provider
      value={{
        variables,
        setVariables,
        devModeContent,
        setDevModeContent,
        isDevModeVisible,
        setDevModeVisibility,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
}
