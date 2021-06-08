/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode, ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductMediaUpdate
// ====================================================

export interface ProductMediaUpdate_productMediaUpdate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductMediaUpdate_productMediaUpdate_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductMediaUpdate_productMediaUpdate_product {
  __typename: "Product";
  id: string;
  media: ProductMediaUpdate_productMediaUpdate_product_media[] | null;
}

export interface ProductMediaUpdate_productMediaUpdate {
  __typename: "ProductMediaUpdate";
  errors: ProductMediaUpdate_productMediaUpdate_errors[];
  product: ProductMediaUpdate_productMediaUpdate_product | null;
}

export interface ProductMediaUpdate {
  productMediaUpdate: ProductMediaUpdate_productMediaUpdate | null;
}

export interface ProductMediaUpdateVariables {
  id: string;
  alt: string;
}
