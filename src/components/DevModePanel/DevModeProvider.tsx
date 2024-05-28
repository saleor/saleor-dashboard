// @ts-strict-ignore
import { DevModeQuery } from "@dashboard/orders/queries";
import { getFilterVariables } from "@dashboard/orders/views/OrderList/filters";
import React, { useState } from "react";
import { useLocation } from "react-router";

import { extractQueryParams } from "../AppLayout/util";
import { DevModeContext } from "./hooks";
import { useDevModeKeyTrigger } from "./useDevModeKeyTrigger";

export function DevModeProvider({ children }) {
  // stringified variables (as key/value) passed along with the query
  const [variables, setVariables] = useState("");
  // stringified GraphQL query; queries can be constructed anywhere in the
  // dashboard to be passed to the dev mode panel
  const [devModeContent, setDevModeContent] = useState("");
  const [isDevModeVisible, setDevModeVisibility] = useState(false);

  const params = extractQueryParams(useLocation().search);
  const triggerHandler = ({ shift }: { shift: boolean }) => {
    if (shift) {
      setDevModeContent(DevModeQuery);

      const variables = JSON.stringify(
        {
          filter: getFilterVariables(params, []),
        },
        null,
        2,
      );

      setVariables(variables);
    } else {
      setDevModeContent("");
      setVariables("");
    }

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
