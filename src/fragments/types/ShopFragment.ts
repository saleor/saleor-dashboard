/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShopFragment
// ====================================================

export interface ShopFragment_limits_currentUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface ShopFragment_limits_allowedUsage {
  __typename: "Limits";
  channels: number | null;
  orders: number | null;
  productVariants: number | null;
  staffUsers: number | null;
  warehouses: number | null;
}

export interface ShopFragment_limits {
  __typename: "LimitInfo";
  currentUsage: ShopFragment_limits_currentUsage;
  allowedUsage: ShopFragment_limits_allowedUsage;
}

export interface ShopFragment_companyAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopFragment_companyAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: ShopFragment_companyAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface ShopFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopFragment_domain {
  __typename: "Domain";
  host: string;
}

export interface ShopFragment {
  __typename: "Shop";
  limits: ShopFragment_limits;
  companyAddress: ShopFragment_companyAddress | null;
  countries: ShopFragment_countries[];
  customerSetPasswordUrl: string | null;
  defaultMailSenderAddress: string | null;
  defaultMailSenderName: string | null;
  description: string | null;
  domain: ShopFragment_domain;
  name: string;
}
