/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum, LanguageCodeEnum, PermissionEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: ShopInfo
// ====================================================

export interface ShopInfo_shop_countries {
  __typename: "CountryDisplay";
  country: string;
  code: string;
}

export interface ShopInfo_shop_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopInfo_shop_domain {
  __typename: "Domain";
  host: string;
  url: string;
}

export interface ShopInfo_shop_languages {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface ShopInfo_shop_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface ShopInfo_shop {
  __typename: "Shop";
  countries: ShopInfo_shop_countries[];
  defaultCountry: ShopInfo_shop_defaultCountry | null;
  defaultWeightUnit: WeightUnitsEnum | null;
  displayGrossPrices: boolean;
  domain: ShopInfo_shop_domain;
  languages: (ShopInfo_shop_languages | null)[];
  includeTaxesInPrices: boolean;
  name: string;
  trackInventoryByDefault: boolean | null;
  permissions: (ShopInfo_shop_permissions | null)[];
}

export interface ShopInfo {
  shop: ShopInfo_shop;
}
