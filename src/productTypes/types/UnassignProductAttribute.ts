/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductTypeKindEnum, AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: UnassignProductAttribute
// ====================================================

export interface UnassignProductAttribute_productAttributeUnassign_errors {
  __typename: "ProductError";
  field: string | null;
  message: string | null;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  inputType: AttributeInputTypeEnum | null;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  inputType: AttributeInputTypeEnum | null;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_assignedVariantAttributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  type: AttributeTypeEnum | null;
  visibleInStorefront: boolean;
  filterableInDashboard: boolean;
  filterableInStorefront: boolean;
  unit: MeasurementUnitsEnum | null;
  inputType: AttributeInputTypeEnum | null;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_assignedVariantAttributes {
  __typename: "AssignedVariantAttribute";
  attribute: UnassignProductAttribute_productAttributeUnassign_productType_assignedVariantAttributes_attribute;
  variantSelection: boolean;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface UnassignProductAttribute_productAttributeUnassign_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  kind: ProductTypeKindEnum;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: UnassignProductAttribute_productAttributeUnassign_productType_taxType | null;
  metadata: (UnassignProductAttribute_productAttributeUnassign_productType_metadata | null)[];
  privateMetadata: (UnassignProductAttribute_productAttributeUnassign_productType_privateMetadata | null)[];
  productAttributes: (UnassignProductAttribute_productAttributeUnassign_productType_productAttributes | null)[] | null;
  variantAttributes: (UnassignProductAttribute_productAttributeUnassign_productType_variantAttributes | null)[] | null;
  assignedVariantAttributes: (UnassignProductAttribute_productAttributeUnassign_productType_assignedVariantAttributes | null)[] | null;
  weight: UnassignProductAttribute_productAttributeUnassign_productType_weight | null;
}

export interface UnassignProductAttribute_productAttributeUnassign {
  __typename: "ProductAttributeUnassign";
  errors: UnassignProductAttribute_productAttributeUnassign_errors[];
  productType: UnassignProductAttribute_productAttributeUnassign_productType | null;
}

export interface UnassignProductAttribute {
  productAttributeUnassign: UnassignProductAttribute_productAttributeUnassign | null;
}

export interface UnassignProductAttributeVariables {
  id: string;
  ids: (string | null)[];
}
