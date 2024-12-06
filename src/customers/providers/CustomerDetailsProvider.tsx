// @ts-strict-ignore
import { CustomerDetailsQuery, useCustomerDetailsQuery } from "@dashboard/graphql";
import { createContext, ReactNode } from "react";

export interface CustomerDetailsProviderProps {
  id: string;
  children: ReactNode;
}

interface CustomerDetailsConsumerProps {
  customer: CustomerDetailsQuery | null;
  loading: boolean | null;
}

export const CustomerDetailsContext = createContext<CustomerDetailsConsumerProps>(null);

export const CustomerDetailsProvider = ({ children, id }: CustomerDetailsProviderProps) => {
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
