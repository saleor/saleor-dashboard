/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MetadataInput, MetadataErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePrivateMetadata
// ====================================================

export interface UpdatePrivateMetadata_updatePrivateMetadata_errors {
  __typename: "MetadataError";
  code: MetadataErrorCode;
  field: string | null;
}

export interface UpdatePrivateMetadata_updatePrivateMetadata_item_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdatePrivateMetadata_updatePrivateMetadata_item_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdatePrivateMetadata_updatePrivateMetadata_item {
  __typename: "App" | "Attribute" | "Category" | "Checkout" | "Collection" | "DigitalContent" | "Fulfillment" | "GiftCard" | "Invoice" | "Menu" | "MenuItem" | "Order" | "Page" | "PageType" | "Payment" | "Product" | "ProductType" | "ProductVariant" | "Sale" | "ShippingMethod" | "ShippingMethodType" | "ShippingZone" | "User" | "Voucher" | "Warehouse";
  metadata: (UpdatePrivateMetadata_updatePrivateMetadata_item_metadata | null)[];
  privateMetadata: (UpdatePrivateMetadata_updatePrivateMetadata_item_privateMetadata | null)[];
  id: string;
}

export interface UpdatePrivateMetadata_updatePrivateMetadata {
  __typename: "UpdatePrivateMetadata";
  errors: UpdatePrivateMetadata_updatePrivateMetadata_errors[];
  item: UpdatePrivateMetadata_updatePrivateMetadata_item | null;
}

export interface UpdatePrivateMetadata_deletePrivateMetadata_errors {
  __typename: "MetadataError";
  code: MetadataErrorCode;
  field: string | null;
}

export interface UpdatePrivateMetadata_deletePrivateMetadata_item_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdatePrivateMetadata_deletePrivateMetadata_item_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UpdatePrivateMetadata_deletePrivateMetadata_item {
  __typename: "App" | "Attribute" | "Category" | "Checkout" | "Collection" | "DigitalContent" | "Fulfillment" | "GiftCard" | "Invoice" | "Menu" | "MenuItem" | "Order" | "Page" | "PageType" | "Payment" | "Product" | "ProductType" | "ProductVariant" | "Sale" | "ShippingMethod" | "ShippingMethodType" | "ShippingZone" | "User" | "Voucher" | "Warehouse";
  metadata: (UpdatePrivateMetadata_deletePrivateMetadata_item_metadata | null)[];
  privateMetadata: (UpdatePrivateMetadata_deletePrivateMetadata_item_privateMetadata | null)[];
  id: string;
}

export interface UpdatePrivateMetadata_deletePrivateMetadata {
  __typename: "DeletePrivateMetadata";
  errors: UpdatePrivateMetadata_deletePrivateMetadata_errors[];
  item: UpdatePrivateMetadata_deletePrivateMetadata_item | null;
}

export interface UpdatePrivateMetadata {
  updatePrivateMetadata: UpdatePrivateMetadata_updatePrivateMetadata | null;
  deletePrivateMetadata: UpdatePrivateMetadata_deletePrivateMetadata | null;
}

export interface UpdatePrivateMetadataVariables {
  id: string;
  input: MetadataInput[];
  keysToDelete: string[];
}
