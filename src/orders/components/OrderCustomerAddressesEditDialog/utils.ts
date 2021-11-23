import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";

import { getById } from "../OrderReturnPage/utils";

export const flatten = (obj: unknown) => {
  // Be cautious that repeated keys are overwritten

  const result = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(result, flatten(obj[key]));
    } else {
      result[key] = obj[key];
    }
  });

  return result;
};

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
  // no default address provided
  if (!defaultAddress) {
    return fallbackAddress;
  }
  // none of customer addresses matches default
  if (!customerAddresses.some(getById(defaultAddress.id))) {
    return fallbackAddress;
  }
  return defaultAddress;
}
