import { type ListCustomersQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export interface AddressTypeInput {
  city: string;
  cityArea?: string;
  companyName?: string;
  country: string;
  countryArea?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}

export interface AddressType {
  id: string;
  city: string;
  cityArea?: string;
  companyName?: string;
  country: {
    code: string;
    country: string;
  };
  countryArea?: string;
  firstName: string;
  lastName: string;
  /**
   * Saleor's Address.phone is nullable; aligning the dashboard type with the
   * schema avoids unsafe narrowing in card UIs that surface address data.
   */
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}

export type Customers = RelayToFlat<NonNullable<ListCustomersQuery["customers"]>>;
export type Customer = Customers[number];
