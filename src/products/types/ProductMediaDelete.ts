/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductMediaDelete
// ====================================================

export interface ProductMediaDelete_productMediaDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductMediaDelete_productMediaDelete_product_media {
  __typename: "ProductMedia";
  id: string;
}

export interface ProductMediaDelete_productMediaDelete_product {
  __typename: "Product";
  id: string;
  media: ProductMediaDelete_productMediaDelete_product_media[] | null;
}

export interface ProductMediaDelete_productMediaDelete {
  __typename: "ProductMediaDelete";
  errors: ProductMediaDelete_productMediaDelete_errors[];
  product: ProductMediaDelete_productMediaDelete_product | null;
}

export interface ProductMediaDelete {
  productMediaDelete: ProductMediaDelete_productMediaDelete | null;
}

export interface ProductMediaDeleteVariables {
  id: string;
}
