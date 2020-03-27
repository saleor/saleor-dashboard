/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageDelete
// ====================================================

export interface ProductImageDelete_productImageDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageDelete_productImageDelete_product_images {
  __typename: "ProductImage";
  id: string;
}

export interface ProductImageDelete_productImageDelete_product {
  __typename: "Product";
  id: string;
  images: (ProductImageDelete_productImageDelete_product_images | null)[] | null;
}

export interface ProductImageDelete_productImageDelete {
  __typename: "ProductImageDelete";
  errors: ProductImageDelete_productImageDelete_errors[];
  product: ProductImageDelete_productImageDelete_product | null;
}

export interface ProductImageDelete {
  productImageDelete: ProductImageDelete_productImageDelete | null;
}

export interface ProductImageDeleteVariables {
  id: string;
}
