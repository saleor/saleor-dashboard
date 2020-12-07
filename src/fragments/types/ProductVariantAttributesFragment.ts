/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductVariantAttributesFragment
// ====================================================

export interface ProductVariantAttributesFragment_attributes_attribute_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_attributes_attribute_values_file | null;
}

export interface ProductVariantAttributesFragment_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantAttributesFragment_attributes_attribute_values | null)[] | null;
}

export interface ProductVariantAttributesFragment_attributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_attributes_values_file | null;
}

export interface ProductVariantAttributesFragment_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductVariantAttributesFragment_attributes_attribute;
  values: (ProductVariantAttributesFragment_attributes_values | null)[];
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantAttributesFragment_productType_variantAttributes_values_file | null;
}

export interface ProductVariantAttributesFragment_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductVariantAttributesFragment_productType_variantAttributes_values | null)[] | null;
}

export interface ProductVariantAttributesFragment_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductVariantAttributesFragment_productType_variantAttributes | null)[] | null;
}

export interface ProductVariantAttributesFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantAttributesFragment_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantAttributesFragment_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantAttributesFragment_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantAttributesFragment_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantAttributesFragment_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantAttributesFragment_channelListings_pricing_priceRange | null;
}

export interface ProductVariantAttributesFragment_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantAttributesFragment_channelListings_channel;
  pricing: ProductVariantAttributesFragment_channelListings_pricing | null;
}

export interface ProductVariantAttributesFragment {
  __typename: "Product";
  id: string;
  attributes: ProductVariantAttributesFragment_attributes[];
  productType: ProductVariantAttributesFragment_productType;
  channelListings: ProductVariantAttributesFragment_channelListings[] | null;
}
