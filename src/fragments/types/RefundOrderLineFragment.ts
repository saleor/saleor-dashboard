/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RefundOrderLineFragment
// ====================================================

export interface RefundOrderLineFragment_variant {
  __typename: "ProductVariant";
  id: string;
}

export interface RefundOrderLineFragment_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface RefundOrderLineFragment_unitPrice {
  __typename: "TaxedMoney";
  gross: RefundOrderLineFragment_unitPrice_gross;
}

export interface RefundOrderLineFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface RefundOrderLineFragment {
  __typename: "OrderLine";
  id: string;
  productName: string;
  quantity: number;
  variant: RefundOrderLineFragment_variant | null;
  unitPrice: RefundOrderLineFragment_unitPrice;
  thumbnail: RefundOrderLineFragment_thumbnail | null;
}
