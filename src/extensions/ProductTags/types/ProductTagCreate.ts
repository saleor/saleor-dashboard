/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductTagCreate
// ====================================================

export interface ProductTagCreate_productTagCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface ProductTagCreate_productTagCreate_productTag_tag {
  __typename: "Tag";
  id: string;
  name: string;
  slug: string;
  created: any;
  modified: any | null;
}

export interface ProductTagCreate_productTagCreate_productTag_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductTagCreate_productTagCreate_productTag_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductTagCreate_productTagCreate_productTag_product {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductTagCreate_productTagCreate_productTag_product_thumbnail | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  productType: ProductTagCreate_productTagCreate_productTag_product_productType;
}

export interface ProductTagCreate_productTagCreate_productTag {
  __typename: "ProductTag";
  id: string;
  tag: ProductTagCreate_productTagCreate_productTag_tag;
  product: ProductTagCreate_productTagCreate_productTag_product;
  created: any;
  modified: any | null;
}

export interface ProductTagCreate_productTagCreate {
  __typename: "ProductTagCreate";
  errors: ProductTagCreate_productTagCreate_errors[];
  productTag: ProductTagCreate_productTagCreate_productTag | null;
}

export interface ProductTagCreate {
  productTagCreate: ProductTagCreate_productTagCreate | null;
}

export interface ProductTagCreateVariables {
  product: string;
  name: string;
}
