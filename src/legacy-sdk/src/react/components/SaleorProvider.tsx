import React, { ReactNode } from "react";

import { SaleorClient } from "../../core";

export interface SaleorProviderProps {
  children: ReactNode;
  client: SaleorClient;
}
export type SaleorContextType = {
  client: SaleorClient;
};

export const SaleorContext = React.createContext<SaleorClient | null>(null);

export function SaleorProvider({ client, children }: SaleorProviderProps) {
  const [context, setContext] = React.useState<SaleorClient>(client);

  React.useEffect(() => {
    setContext(client);
  }, [client]);

  if (context) {
    return <SaleorContext.Provider value={context}>{children}</SaleorContext.Provider>;
  }

  return null;
}
