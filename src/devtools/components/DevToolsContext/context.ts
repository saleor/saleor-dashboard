import * as React from 'react';

export interface DevToolsData {
  requests: any[];
  appendRequest: (request: any) => void;
}

export const DevToolsContext = React.createContext<DevToolsData>({
  requests: [],
  appendRequest: () => null
});
