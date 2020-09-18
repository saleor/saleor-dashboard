/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CustomerCreateData
// ====================================================

export interface CustomerCreateData_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface CustomerCreateData_shop {
  __typename: "Shop";
  countries: CustomerCreateData_shop_countries[];
}

export interface CustomerCreateData {
  shop: CustomerCreateData_shop;
}
