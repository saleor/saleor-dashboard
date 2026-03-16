import React from "react";

import { type SaleorClient } from "../../core";

export const SaleorContext = React.createContext<SaleorClient | null>(null);

export const SaleorProvider: React.FC<React.PropsWithChildren<{ client: SaleorClient }>> = ({
  client,
  children,
}) => {
  const [context, setContext] = React.useState<SaleorClient>(client);

  React.useEffect(() => {
    setContext(client);
  }, [client]);

  if (context) {
    return <SaleorContext.Provider value={context}>{children}</SaleorContext.Provider>;
  }

  return null;
};
