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
  __typename: "App" | "Attribute" | "Category" | "Checkout" | "Collection" | "DigitalContent" | "Fulfillment" | "GiftCard" | "Invoice" | "Menu" | "MenuItem" | "Order" | "Page" | "PageType" | "Payment" | "Product" | "ProductType" | "ProductVariant" | "Sale" | "ShippingMethod" | "ShippingMethodType" | "ShippingZone" | "User" | "Voucher" | "Warehouse";
  metadata: (MetadataFragment_metadata | null)[];
  privateMetadata: (MetadataFragment_privateMetadata | null)[];
}
