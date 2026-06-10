import { type AddressType } from "@dashboard/customers/types";

/**
 * Flattens a structured address into a newline-separated string suitable for
 * pasting into another tool (CRM, email, shipping label, etc.). Empty parts
 * are dropped so we never produce blank lines.
 */
export const formatAddressForClipboard = (address: AddressType): string => {
  const lines = [
    [address.firstName, address.lastName].filter(Boolean).join(" "),
    address.companyName,
    address.streetAddress1,
    address.streetAddress2,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.countryArea,
    address.country?.country,
    address.phone,
  ].filter(Boolean);

  return lines.join("\n");
};
