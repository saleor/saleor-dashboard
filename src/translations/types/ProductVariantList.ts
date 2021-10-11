/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProductVariantList
// ====================================================

export interface ProductVariantList_product_variants {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
}

export interface ProductVariantList_product {
  __typename: "Product";
  id: string;
  variants: (ProductVariantList_product_variants | null)[] | null;
}

export interface ProductVariantList {
  product: ProductVariantList_product | null;
}

export interface ProductVariantListVariables {
  id: string;
}
