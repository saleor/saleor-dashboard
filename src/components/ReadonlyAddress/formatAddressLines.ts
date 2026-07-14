import { type ReadonlyAddressData } from "./types";

export const getAddressDisplayName = (address: ReadonlyAddressData): string =>
  [address.firstName, address.lastName].filter(Boolean).join(" ");

export const getAddressStreetLine = (address: ReadonlyAddressData): string | null => {
  const parts = [address.streetAddress1, address.streetAddress2].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
};

export const getAddressCityLine = (address: ReadonlyAddressData): string | null => {
  const cityParts = [address.postalCode, address.city, address.cityArea].filter(Boolean);

  return cityParts.length > 0 ? cityParts.join(" ") : null;
};

export const getAddressCountryLine = (address: ReadonlyAddressData): string => {
  if (address.countryArea) {
    return `${address.countryArea}, ${address.country.country}`;
  }

  return address.country.country;
};
