import React, { createContext } from "react";

import { useCustomerDetails } from "../queries";
import { CustomerDetails } from "../types/CustomerDetails";

export interface CustomerDetailsProviderProps {
  id: string;
}

interface CustomerDetailsConsumerProps {
  customer: CustomerDetails | null;
  loading: boolean | null;
}

export const CustomerDetailsContext = createContext<
  CustomerDetailsConsumerProps
>(null);

export const CustomerDetailsProvider: React.FC<CustomerDetailsProviderProps> = ({
  children,
  id
}) => {
  const { data, loading } = useCustomerDetails({
    displayLoader: true,
    variables: {
      id
    }
  });

  const providerValues: CustomerDetailsConsumerProps = {
    customer: data,
    loading
  };

  return (
    <CustomerDetailsContext.Provider value={providerValues}>
      {children}
    </CustomerDetailsContext.Provider>
  );
};
