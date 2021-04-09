/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductVariantCreateData
// ====================================================

export interface ProductVariantCreateData_product_media {
  __typename: "ProductMedia";
  id: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductVariantCreateData_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantCreateData_product_channelListings {
  __typename: "ProductChannelListing";
  channel: ProductVariantCreateData_product_channelListings_channel;
}

export interface ProductVariantCreateData_product_productType_selectionVariantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantCreateData_product_productType_selectionVariantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantCreateData_product_productType_selectionVariantAttributes_values_file | null;
  reference: string | null;
}

export interface ProductVariantCreateData_product_productType_selectionVariantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantCreateData_product_productType_selectionVariantAttributes_values | null)[] | null;
}

export interface ProductVariantCreateData_product_productType_nonSelectionVariantAttributes_values_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductVariantCreateData_product_productType_nonSelectionVariantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductVariantCreateData_product_productType_nonSelectionVariantAttributes_values_file | null;
  reference: string | null;
}

export interface ProductVariantCreateData_product_productType_nonSelectionVariantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  valueRequired: boolean;
  values: (ProductVariantCreateData_product_productType_nonSelectionVariantAttributes_values | null)[] | null;
}

export interface ProductVariantCreateData_product_productType {
  __typename: "ProductType";
  id: string;
  selectionVariantAttributes: (ProductVariantCreateData_product_productType_selectionVariantAttributes | null)[] | null;
  nonSelectionVariantAttributes: (ProductVariantCreateData_product_productType_nonSelectionVariantAttributes | null)[] | null;
}

export interface ProductVariantCreateData_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductVariantCreateData_product_variants_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  type: ProductMediaType;
}

export interface ProductVariantCreateData_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string;
  media: ProductVariantCreateData_product_variants_media[] | null;
}

export interface ProductVariantCreateData_product {
  __typename: "Product";
  id: string;
  media: ProductVariantCreateData_product_media[] | null;
  channelListings: ProductVariantCreateData_product_channelListings[] | null;
  name: string;
  productType: ProductVariantCreateData_product_productType;
  thumbnail: ProductVariantCreateData_product_thumbnail | null;
  variants: (ProductVariantCreateData_product_variants | null)[] | null;
}

export interface ProductVariantCreateData {
  product: ProductVariantCreateData_product | null;
}

export interface ProductVariantCreateDataVariables {
  id: string;
}
