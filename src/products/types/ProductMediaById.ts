/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductMediaType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductMediaById
// ====================================================

export interface ProductMediaById_product_mainImage {
  __typename: "ProductMedia";
  id: string;
  alt: string;
  url: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductMediaById_product_media {
  __typename: "ProductMedia";
  id: string;
  url: string;
  alt: string;
  type: ProductMediaType;
  oembedData: any;
}

export interface ProductMediaById_product {
  __typename: "Product";
  id: string;
  name: string;
  mainImage: ProductMediaById_product_mainImage | null;
  media: ProductMediaById_product_media[] | null;
}

export interface ProductMediaById {
  product: ProductMediaById_product | null;
}

export interface ProductMediaByIdVariables {
  productId: string;
  mediaId: string;
}
