/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FetchTaxes
// ====================================================

export interface FetchTaxes_shopFetchTaxRates_errors {
  __typename: "ShopError";
  field: string | null;
  message: string | null;
}

export interface FetchTaxes_shopFetchTaxRates_shop_countries {
  __typename: "CountryDisplay";
  country: string;
  code: string;
}

export interface FetchTaxes_shopFetchTaxRates_shop {
  __typename: "Shop";
  countries: FetchTaxes_shopFetchTaxRates_shop_countries[];
}

export interface FetchTaxes_shopFetchTaxRates {
  __typename: "ShopFetchTaxRates";
  errors: FetchTaxes_shopFetchTaxRates_errors[];
  shop: FetchTaxes_shopFetchTaxRates_shop | null;
}

export interface FetchTaxes {
  shopFetchTaxRates: FetchTaxes_shopFetchTaxRates | null;
}
