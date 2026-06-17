// @ts-strict-ignore
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import { type CustomerDetailsQuery, useCustomerDetailsQuery } from "@dashboard/graphql";
import type * as React from "react";
import { createContext } from "react";

interface CustomerDetailsProviderProps {
  id: string;
}

interface CustomerDetailsConsumerProps {
  customer: CustomerDetailsQuery | null;
  loading: boolean | null;
}

export const CustomerDetailsContext = createContext<CustomerDetailsConsumerProps>(null);

export const CustomerDetailsProvider = ({
  children,
  id,
}: CustomerDetailsProviderProps & { children: React.ReactNode }) => {
  const { data, loading, refetch } = useCustomerDetailsQuery({
    displayLoader: true,
    variables: {
      id,
    },
  });

  useRegisterEntityRefresh(refetch);

  const providerValues: CustomerDetailsConsumerProps = {
    customer: data,
    loading,
  };

  return (
    <CustomerDetailsContext.Provider value={providerValues}>
      {children}
    </CustomerDetailsContext.Provider>
  );
};
