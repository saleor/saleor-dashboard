/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode, AttributeInputTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageUpdate
// ====================================================

export interface ProductImageUpdate_productImageUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  inputType: AttributeInputTypeEnum | null;
  valueRequired: boolean;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: ProductImageUpdate_productImageUpdate_product_attributes_attribute;
  values: (ProductImageUpdate_productImageUpdate_product_attributes_values | null)[];
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  values: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes_values | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product_productType {
  __typename: "ProductType";
  id: string;
  variantAttributes: (ProductImageUpdate_productImageUpdate_product_productType_variantAttributes | null)[] | null;
  name: string;
  hasVariants: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductImageUpdate_productImageUpdate_product_channelListing_channel;
  discountedPrice: ProductImageUpdate_productImageUpdate_product_channelListing_discountedPrice | null;
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
}

export interface ProductImageUpdate_productImageUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: ProductImageUpdate_productImageUpdate_product_variants_stocks_warehouse;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListing_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductImageUpdate_productImageUpdate_product_variants_channelListing {
  __typename: "ProductVariantChannelListing";
  channel: ProductImageUpdate_productImageUpdate_product_variants_channelListing_channel;
  price: ProductImageUpdate_productImageUpdate_product_variants_channelListing_price | null;
}

export interface ProductImageUpdate_productImageUpdate_product_variants {
  __typename: "ProductVariant";
  id: string;
  sku: string;
  name: string;
  margin: number | null;
  stocks: (ProductImageUpdate_productImageUpdate_product_variants_stocks | null)[] | null;
  trackInventory: boolean;
  channelListing: ProductImageUpdate_productImageUpdate_product_variants_channelListing[] | null;
}

export interface ProductImageUpdate_productImageUpdate_product {
  __typename: "Product";
  id: string;
  attributes: ProductImageUpdate_productImageUpdate_product_attributes[];
  productType: ProductImageUpdate_productImageUpdate_product_productType;
  channelListing: ProductImageUpdate_productImageUpdate_product_channelListing[] | null;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: ProductImageUpdate_productImageUpdate_product_category | null;
  collections: (ProductImageUpdate_productImageUpdate_product_collections | null)[] | null;
  chargeTaxes: boolean;
  images: (ProductImageUpdate_productImageUpdate_product_images | null)[] | null;
  variants: (ProductImageUpdate_productImageUpdate_product_variants | null)[] | null;
}

export interface ProductImageUpdate_productImageUpdate {
  __typename: "ProductImageUpdate";
  errors: ProductImageUpdate_productImageUpdate_errors[];
  product: ProductImageUpdate_productImageUpdate_product | null;
}

export interface ProductImageUpdate {
  productImageUpdate: ProductImageUpdate_productImageUpdate | null;
}

export interface ProductImageUpdateVariables {
  id: string;
  alt: string;
}
