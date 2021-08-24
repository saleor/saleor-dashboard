/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductTagFragment
// ====================================================

export interface ProductTagFragment_tag {
  __typename: "Tag";
  id: string;
  name: string;
  slug: string;
  created: any;
  modified: any | null;
}

export interface ProductTagFragment_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductTagFragment_product_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductTagFragment_product {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductTagFragment_product_thumbnail | null;
  isAvailable: boolean | null;
  isPublished: boolean;
  productType: ProductTagFragment_product_productType;
}

export interface ProductTagFragment {
  __typename: "ProductTag";
  id: string;
  tag: ProductTagFragment_tag;
  product: ProductTagFragment_product;
  created: any;
  modified: any | null;
}
