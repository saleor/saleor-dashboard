/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductTypeKindEnum } from "./../../types/globalTypes";

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

export interface RefundOrderLineFragment_variant_product_productType {
  __typename: "ProductType";
  id: string;
  kind: ProductTypeKindEnum;
}

export interface RefundOrderLineFragment_variant_product {
  __typename: "Product";
  id: string;
  productType: RefundOrderLineFragment_variant_product_productType;
}

export interface RefundOrderLineFragment_variant {
  __typename: "ProductVariant";
  id: string;
  product: RefundOrderLineFragment_variant_product;
}

export interface RefundOrderLineFragment {
  __typename: "OrderLine";
  id: string;
  productName: string;
  quantity: number;
  unitPrice: RefundOrderLineFragment_unitPrice;
  thumbnail: RefundOrderLineFragment_thumbnail | null;
  variant: RefundOrderLineFragment_variant | null;
}
