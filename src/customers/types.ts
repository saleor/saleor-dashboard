import { FilterOpts, MinMax } from "@saleor/types";

export interface CustomerListFilterOpts {
  joined: FilterOpts<MinMax>;
  moneySpent: FilterOpts<MinMax>;
  numberOfOrders: FilterOpts<MinMax>;
}

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
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}
