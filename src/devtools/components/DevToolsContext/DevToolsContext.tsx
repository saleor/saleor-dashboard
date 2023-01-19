import React from "react";

import { DevToolsContext } from "./context";

export const DevToolsProvider = ({ children }) => {
  const [requests, setRequests] = React.useState<any[]>([]);

  const appendRequest = (request: any) => {
    setRequests([...requests, request])
  }

  return (
    <DevToolsContext.Provider value={{ requests, appendRequest }}>
      {children}
    </DevToolsContext.Provider>
  );
};

export const useDevTools = () => {
  const { requests, appendRequest } = React.useContext(DevToolsContext);

  return {
    requests,
    appendRequest,
  };
};
