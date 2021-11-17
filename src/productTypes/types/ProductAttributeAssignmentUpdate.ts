/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductAttributeAssignmentUpdateInput, ProductTypeKindEnum, AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductAttributeAssignmentUpdate
// ====================================================

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_errors {
  __typename: "ProductError";
  field: string | null;
  message: string | null;
  attributes: string[] | null;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_productAttributes {
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

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_variantAttributes {
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

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_assignedVariantAttributes_attribute {
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

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_assignedVariantAttributes {
  __typename: "AssignedVariantAttribute";
  attribute: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_assignedVariantAttributes_attribute;
  variantSelection: boolean;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  kind: ProductTypeKindEnum;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_taxType | null;
  metadata: (ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_metadata | null)[];
  privateMetadata: (ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_privateMetadata | null)[];
  productAttributes: (ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_productAttributes | null)[] | null;
  variantAttributes: (ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_variantAttributes | null)[] | null;
  assignedVariantAttributes: (ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_assignedVariantAttributes | null)[] | null;
  weight: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType_weight | null;
}

export interface ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate {
  __typename: "ProductAttributeAssignmentUpdate";
  errors: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_errors[];
  productType: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate_productType | null;
}

export interface ProductAttributeAssignmentUpdate {
  productAttributeAssignmentUpdate: ProductAttributeAssignmentUpdate_productAttributeAssignmentUpdate | null;
}

export interface ProductAttributeAssignmentUpdateVariables {
  operations: (ProductAttributeAssignmentUpdateInput | null)[];
  productTypeId: string;
}
