/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductTagDelete
// ====================================================

export interface ProductTagDelete_productTagDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductTagDelete_productTagDelete_productTag_tag {
  __typename: "Tag";
  id: string;
  name: string;
  slug: string;
  created: any;
  modified: any | null;
}

export interface ProductTagDelete_productTagDelete_productTag_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductTagDelete_productTagDelete_productTag_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductTagDelete_productTagDelete_productTag_product {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductTagDelete_productTagDelete_productTag_product_thumbnail | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  productType: ProductTagDelete_productTagDelete_productTag_product_productType;
}

export interface ProductTagDelete_productTagDelete_productTag {
  __typename: "ProductTag";
  id: string;
  tag: ProductTagDelete_productTagDelete_productTag_tag;
  product: ProductTagDelete_productTagDelete_productTag_product;
  created: any;
  modified: any | null;
}

export interface ProductTagDelete_productTagDelete {
  __typename: "ProductTagDelete";
  errors: ProductTagDelete_productTagDelete_errors[];
  productTag: ProductTagDelete_productTagDelete_productTag | null;
}

export interface ProductTagDelete {
  productTagDelete: ProductTagDelete_productTagDelete | null;
}

export interface ProductTagDeleteVariables {
  id: string;
}
