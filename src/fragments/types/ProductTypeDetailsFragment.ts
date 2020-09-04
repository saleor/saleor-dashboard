/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ProductTypeDetailsFragment
// ====================================================

export interface ProductTypeDetailsFragment_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductTypeDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductTypeDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductTypeDetailsFragment_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface ProductTypeDetailsFragment_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  valueRequired: boolean;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface ProductTypeDetailsFragment_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductTypeDetailsFragment {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: ProductTypeDetailsFragment_taxType | null;
  metadata: (ProductTypeDetailsFragment_metadata | null)[];
  privateMetadata: (ProductTypeDetailsFragment_privateMetadata | null)[];
  productAttributes: (ProductTypeDetailsFragment_productAttributes | null)[] | null;
  variantAttributes: (ProductTypeDetailsFragment_variantAttributes | null)[] | null;
  weight: ProductTypeDetailsFragment_weight | null;
}
