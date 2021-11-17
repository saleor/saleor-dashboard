import { CustomerAddresses_user_addresses } from "@saleor/customers/types/CustomerAddresses";

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

export const parseAddress = (
  address: Partial<CustomerAddresses_user_addresses>
): string => {
  const { id, ...addressWithoutId } = address;
  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");
