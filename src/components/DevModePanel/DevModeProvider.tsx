// @ts-strict-ignore
import React, { useState } from "react";

import { DevModeContext } from "./hooks";
import { useDevModeKeyTrigger } from "./useDevModeKeyTrigger";

export function DevModeProvider({ children }) {
  // stringified variables (as key/value) passed along with the query
  const [variables, setVariables] = useState("");
  // stringified GraphQL query; queries can be constructed anywhere in the
  // dashboard to be passed to the dev mode panel
  const [devModeContent, setDevModeContent] = useState("");
  const [isDevModeVisible, setDevModeVisibility] = useState(false);

  const triggerHandler = () => {
    setDevModeContent("");
    setVariables("");

    setDevModeVisibility(!isDevModeVisible);
  };

  useDevModeKeyTrigger(triggerHandler);

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
