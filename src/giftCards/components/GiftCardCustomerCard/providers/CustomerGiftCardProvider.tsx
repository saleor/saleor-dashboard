import { CustomerDetails_user } from "@saleor/customers/types/CustomerDetails";
import { GiftCardCreateFormCustomer } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { getFullName } from "@saleor/misc";
import React from "react";
import { createContext } from "react";

interface CustomerGiftCardProviderProps {
  customer: CustomerDetails_user;
}

export type ExtendedGiftCardCustomerForm<
  T extends GiftCardCreateFormCustomer
> = T & {
  id: string;
};

export const CustomerGiftCardContext = createContext<
  ExtendedGiftCardCustomerForm<GiftCardCreateFormCustomer>
>(null);

function getSkimmedCustomer<T extends CustomerDetails_user>(
  customer?: T
): ExtendedGiftCardCustomerForm<GiftCardCreateFormCustomer> {
  if (!customer) {
    return undefined;
  }

  const { email, firstName, lastName, id } = customer;

  const name = getFullName({
    lastName,
    firstName
  });

  return {
    email,
    name,
    id
  };
}

export const CustomerGiftCardProvider: React.FC<CustomerGiftCardProviderProps> = ({
  customer,
  children
}) => (
  <CustomerGiftCardContext.Provider value={getSkimmedCustomer(customer)}>
    {children}
  </CustomerGiftCardContext.Provider>
);
