import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";
import { flatten } from "@saleor/misc";

import { getById } from "../OrderReturnPage/utils";

export const stringifyAddress = (
  address: Partial<CustomerAddresses_user_addresses>
): string => {
  const { id, ...addressWithoutId } = address;
  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function validateDefaultAddress<
  T extends CustomerAddresses_user_defaultShippingAddress
>(
  defaultAddress: CustomerAddresses_user_defaultShippingAddress,
  customerAddresses: T[]
): CustomerAddresses_user_defaultShippingAddress {
  const fallbackAddress = {
    id: customerAddresses[0]?.id
  } as CustomerAddresses_user_defaultShippingAddress;
  if (!defaultAddress) {
    return fallbackAddress;
  }
  if (!customerAddresses.some(getById(defaultAddress.id))) {
    return fallbackAddress;
  }
  return defaultAddress;
}
