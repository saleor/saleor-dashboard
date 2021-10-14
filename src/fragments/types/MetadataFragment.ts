/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MetadataFragment
// ====================================================

export interface MetadataFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface MetadataFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface MetadataFragment {
  __typename: "App" | "Warehouse" | "ShippingZone" | "ShippingMethod" | "Product" | "ProductType" | "Attribute" | "Category" | "ProductVariant" | "DigitalContent" | "Collection" | "Page" | "PageType" | "Sale" | "Voucher" | "MenuItem" | "Menu" | "User" | "Checkout" | "Order" | "Fulfillment" | "Invoice";
  metadata: (MetadataFragment_metadata | null)[];
  privateMetadata: (MetadataFragment_privateMetadata | null)[];
}
