/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrderLineFragment
// ====================================================

export interface OrderLineFragment_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineFragment_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineFragment_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineFragment_unitPrice_gross;
  net: OrderLineFragment_unitPrice_net;
}

export interface OrderLineFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineFragment {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineFragment_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineFragment_unitPrice | null;
  thumbnail: OrderLineFragment_thumbnail | null;
}
