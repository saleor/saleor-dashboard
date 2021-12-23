/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShippingCountriesNotAssigned
// ====================================================

export interface ShippingCountriesNotAssigned_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShippingCountriesNotAssigned_shop {
  __typename: "Shop";
  countries: ShippingCountriesNotAssigned_shop_countries[];
}

export interface ShippingCountriesNotAssigned {
  shop: ShippingCountriesNotAssigned_shop;
}
