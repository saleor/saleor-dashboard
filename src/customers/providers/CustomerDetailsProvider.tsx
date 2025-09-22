// @ts-strict-ignore
import { CustomerDetailsQuery, useCustomerDetailsQuery } from "@dashboard/graphql";
import { createContext } from "react";
import * as React from "react";

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
  const { data, loading } = useCustomerDetailsQuery({
    displayLoader: true,
    variables: {
      id,
    },
  });
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
