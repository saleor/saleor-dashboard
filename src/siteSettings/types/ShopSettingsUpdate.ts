/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SiteDomainInput, ShopSettingsInput, AddressInput, ShopErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShopSettingsUpdate
// ====================================================

export interface ShopSettingsUpdate_shopSettingsUpdate_errors {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
}

export interface ShopSettingsUpdate_shopSettingsUpdate_shop_companyAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopSettingsUpdate_shopSettingsUpdate_shop_companyAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: ShopSettingsUpdate_shopSettingsUpdate_shop_companyAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface ShopSettingsUpdate_shopSettingsUpdate_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopSettingsUpdate_shopSettingsUpdate_shop_domain {
  __typename: "Domain";
  host: string;
}

export interface ShopSettingsUpdate_shopSettingsUpdate_shop {
  __typename: "Shop";
  companyAddress: ShopSettingsUpdate_shopSettingsUpdate_shop_companyAddress | null;
  countries: ShopSettingsUpdate_shopSettingsUpdate_shop_countries[];
  customerSetPasswordUrl: string | null;
  defaultMailSenderAddress: string | null;
  defaultMailSenderName: string | null;
  description: string | null;
  domain: ShopSettingsUpdate_shopSettingsUpdate_shop_domain;
  name: string;
}

export interface ShopSettingsUpdate_shopSettingsUpdate {
  __typename: "ShopSettingsUpdate";
  errors: ShopSettingsUpdate_shopSettingsUpdate_errors[];
  shop: ShopSettingsUpdate_shopSettingsUpdate_shop | null;
}

export interface ShopSettingsUpdate_shopDomainUpdate_errors {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
}

export interface ShopSettingsUpdate_shopDomainUpdate_shop_domain {
  __typename: "Domain";
  host: string;
  url: string;
}

export interface ShopSettingsUpdate_shopDomainUpdate_shop {
  __typename: "Shop";
  domain: ShopSettingsUpdate_shopDomainUpdate_shop_domain;
}

export interface ShopSettingsUpdate_shopDomainUpdate {
  __typename: "ShopDomainUpdate";
  errors: ShopSettingsUpdate_shopDomainUpdate_errors[];
  shop: ShopSettingsUpdate_shopDomainUpdate_shop | null;
}

export interface ShopSettingsUpdate_shopAddressUpdate_errors {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
}

export interface ShopSettingsUpdate_shopAddressUpdate_shop_companyAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface ShopSettingsUpdate_shopAddressUpdate_shop_companyAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: ShopSettingsUpdate_shopAddressUpdate_shop_companyAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface ShopSettingsUpdate_shopAddressUpdate_shop {
  __typename: "Shop";
  companyAddress: ShopSettingsUpdate_shopAddressUpdate_shop_companyAddress | null;
}

export interface ShopSettingsUpdate_shopAddressUpdate {
  __typename: "ShopAddressUpdate";
  errors: ShopSettingsUpdate_shopAddressUpdate_errors[];
  shop: ShopSettingsUpdate_shopAddressUpdate_shop | null;
}

export interface ShopSettingsUpdate {
  shopSettingsUpdate: ShopSettingsUpdate_shopSettingsUpdate | null;
  shopDomainUpdate: ShopSettingsUpdate_shopDomainUpdate | null;
  shopAddressUpdate: ShopSettingsUpdate_shopAddressUpdate | null;
}

export interface ShopSettingsUpdateVariables {
  shopDomainInput: SiteDomainInput;
  shopSettingsInput: ShopSettingsInput;
  addressInput?: AddressInput | null;
}
