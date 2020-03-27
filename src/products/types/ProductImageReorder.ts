/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductImageReorder
// ====================================================

export interface ProductImageReorder_productImageReorder_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductImageReorder_productImageReorder_product_images {
  __typename: "ProductImage";
  id: string;
  alt: string;
  sortOrder: number | null;
  url: string;
}

export interface ProductImageReorder_productImageReorder_product {
  __typename: "Product";
  id: string;
  images: (ProductImageReorder_productImageReorder_product_images | null)[] | null;
}

export interface ProductImageReorder_productImageReorder {
  __typename: "ProductImageReorder";
  errors: ProductImageReorder_productImageReorder_errors[];
  product: ProductImageReorder_productImageReorder_product | null;
}

export interface ProductImageReorder {
  productImageReorder: ProductImageReorder_productImageReorder | null;
}

export interface ProductImageReorderVariables {
  productId: string;
  imagesIds: (string | null)[];
}
