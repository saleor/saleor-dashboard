import { AddressFragment } from "@dashboard/graphql";

export const prepareAddressForClipboard = (address: AddressFragment) => {
  const lines: string[] = [];
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");

  if (name) {
    lines.push(name);
  }

  if (address.phone) {
    lines.push(address.phone);
  }

  if (address.companyName) {
    lines.push(address.companyName);
  }

  const street = [address.streetAddress1, address.streetAddress2].filter(Boolean).join(" ");

  if (street) {
    lines.push(street);
  }

  const cityLine = [address.postalCode, address.city].filter(Boolean).join(" ");

  if (cityLine) {
    lines.push(cityLine);
  }

  const countryLine = [address.countryArea, address.country?.country].filter(Boolean).join(" ");

  if (countryLine) {
    lines.push(countryLine);
  }

  return lines.join("\n");
};
