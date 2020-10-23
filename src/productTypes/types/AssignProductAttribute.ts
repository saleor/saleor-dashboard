/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProductAttributeAssignInput, AttributeTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AssignProductAttribute
// ====================================================

export interface AssignProductAttribute_productAttributeAssign_errors {
  __typename: "ProductError";
  field: string | null;
  message: string | null;
}

export interface AssignProductAttribute_productAttributeAssign_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface AssignProductAttribute_productAttributeAssign_productType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AssignProductAttribute_productAttributeAssign_productType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface AssignProductAttribute_productAttributeAssign_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface AssignProductAttribute_productAttributeAssign_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
}

export interface AssignProductAttribute_productAttributeAssign_productType_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface AssignProductAttribute_productAttributeAssign_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: AssignProductAttribute_productAttributeAssign_productType_taxType | null;
  metadata: (AssignProductAttribute_productAttributeAssign_productType_metadata | null)[];
  privateMetadata: (AssignProductAttribute_productAttributeAssign_productType_privateMetadata | null)[];
  productAttributes: (AssignProductAttribute_productAttributeAssign_productType_productAttributes | null)[] | null;
  variantAttributes: (AssignProductAttribute_productAttributeAssign_productType_variantAttributes | null)[] | null;
  weight: AssignProductAttribute_productAttributeAssign_productType_weight | null;
}

export interface AssignProductAttribute_productAttributeAssign {
  __typename: "ProductAttributeAssign";
  errors: AssignProductAttribute_productAttributeAssign_errors[];
  productType: AssignProductAttribute_productAttributeAssign_productType | null;
}

export interface AssignProductAttribute {
  productAttributeAssign: AssignProductAttribute_productAttributeAssign | null;
}

export interface AssignProductAttributeVariables {
  id: string;
  operations: ProductAttributeAssignInput[];
}
