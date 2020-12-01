/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RefundOrderLineFragment
// ====================================================

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
  unitPrice: RefundOrderLineFragment_unitPrice | null;
  thumbnail: RefundOrderLineFragment_thumbnail | null;
}
