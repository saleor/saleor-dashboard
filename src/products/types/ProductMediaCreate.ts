/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductMediaCreate
// ====================================================

export interface ProductMediaCreate_productMediaCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductMediaCreate_productMediaCreate_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductMediaCreate_productMediaCreate_product {
  __typename: "Product";
  id: string;
  media: ProductMediaCreate_productMediaCreate_product_media[] | null;
}

export interface ProductMediaCreate_productMediaCreate {
  __typename: "ProductMediaCreate";
  errors: ProductMediaCreate_productMediaCreate_errors[];
  product: ProductMediaCreate_productMediaCreate_product | null;
}

export interface ProductMediaCreate {
  productMediaCreate: ProductMediaCreate_productMediaCreate | null;
}

export interface ProductMediaCreateVariables {
  product: string;
  image?: any | null;
  alt?: string | null;
  mediaUrl?: string | null;
}
