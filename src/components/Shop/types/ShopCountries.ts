/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CountryFilterInput } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShopCountries
// ====================================================

export interface ShopCountries_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopCountries_shop {
  __typename: "Shop";
  countries: ShopCountries_shop_countries[];
}

export interface ShopCountries {
  shop: ShopCountries_shop;
}

export interface ShopCountriesVariables {
  filter?: CountryFilterInput | null;
}
