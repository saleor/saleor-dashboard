/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Metadata
// ====================================================

export interface Metadata_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Metadata_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface Metadata {
  __typename: "ServiceAccount" | "App" | "Product" | "ProductType" | "Attribute" | "Category" | "ProductVariant" | "DigitalContent" | "Collection" | "User" | "Checkout" | "Order" | "Fulfillment" | "Invoice";
  metadata: (Metadata_metadata | null)[];
  privateMetadata: (Metadata_privateMetadata | null)[];
}
