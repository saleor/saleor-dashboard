/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductChannelListingUpdateInput, AttributeInputTypeEnum, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductChannelListingUpdate
// ====================================================

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_attribute;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_attributes_values | null)[];
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductChannelListingUpdate_productChannelListingUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_start_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_start {
  __typename: "TaxedMoney";
  gross: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_start_gross;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_stop_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_stop {
  __typename: "TaxedMoney";
  gross: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_stop_gross;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted {
  __typename: "TaxedMoneyRange";
  start: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_start | null;
  stop: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted_stop | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_pricing {
  __typename: "ProductPricingInfo";
  priceRangeUndiscounted: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing_priceRangeUndiscounted | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_channel;
  discountedPrice: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_discountedPrice | null;
  isPublished: boolean;
  publicationDate: any | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost_start | null;
  stop: ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost_stop | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_channel;
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing_discountedPrice | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks_warehouse;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing_price_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing_price {
  __typename: "TaxedMoney";
  gross: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing_price_gross;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing {
  __typename: "VariantPricingInfo";
  price: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing_price | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductChannelListingUpdate_productChannelListingUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  pricing: ProductChannelListingUpdate_productChannelListingUpdate_product_variants_pricing | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductChannelListingUpdate_productChannelListingUpdate_product_attributes[];
  productType: ProductChannelListingUpdate_productChannelListingUpdate_product_productType;
  pricing: ProductChannelListingUpdate_productChannelListingUpdate_product_pricing | null;
  channelListing: ProductChannelListingUpdate_productChannelListingUpdate_product_channelListing[] | null;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductChannelListingUpdate_productChannelListingUpdate_product_category | null;
  collections: (ProductChannelListingUpdate_productChannelListingUpdate_product_collections | null)[] | null;
  margin: ProductChannelListingUpdate_productChannelListingUpdate_product_margin | null;
  purchaseCost: ProductChannelListingUpdate_productChannelListingUpdate_product_purchaseCost | null;
  isAvailable: boolean | null;
  chargeTaxes: boolean;
  images: (ProductChannelListingUpdate_productChannelListingUpdate_product_images | null)[] | null;
  variants: (ProductChannelListingUpdate_productChannelListingUpdate_product_variants | null)[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate_productChannelListingErrors {
  __typename: "ProductChannelListingError";
  field: string | null;
  message: string | null;
  code: ProductErrorCode;
  channels: string[] | null;
}

export interface ProductChannelListingUpdate_productChannelListingUpdate {
  __typename: "ProductChannelListingUpdate";
  product: ProductChannelListingUpdate_productChannelListingUpdate_product | null;
  productChannelListingErrors: ProductChannelListingUpdate_productChannelListingUpdate_productChannelListingErrors[];
}

export interface ProductChannelListingUpdate {
  productChannelListingUpdate: ProductChannelListingUpdate_productChannelListingUpdate | null;
}

export interface ProductChannelListingUpdateVariables {
  id: string;
  input: ProductChannelListingUpdateInput;
}
