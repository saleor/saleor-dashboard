/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductMediaReorder
// ====================================================

export interface ProductMediaReorder_productMediaReorder_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductMediaReorder_productMediaReorder_product_media {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductMediaReorder_productMediaReorder_product {
  __typename: "Product";
  id: string;
  media: (ProductMediaReorder_productMediaReorder_product_media | null)[] | null;
}

export interface ProductMediaReorder_productMediaReorder {
  __typename: "ProductMediaReorder";
  errors: ProductMediaReorder_productMediaReorder_errors[];
  product: ProductMediaReorder_productMediaReorder_product | null;
}

export interface ProductMediaReorder {
  productMediaReorder: ProductMediaReorder_productMediaReorder | null;
}

export interface ProductMediaReorderVariables {
  productId: string;
  mediaIds: (string | null)[];
}
