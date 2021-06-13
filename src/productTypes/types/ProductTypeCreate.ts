/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductTypeInput, AttributeTypeEnum, MeasurementUnitsEnum, AttributeInputTypeEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductTypeCreate
// ====================================================

export interface ProductTypeCreate_productTypeCreate_errors {
  __typename: "ProductError";
  field: string | null;
  message: string | null;
}

export interface ProductTypeCreate_productTypeCreate_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductTypeCreate_productTypeCreate_productType_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductTypeCreate_productTypeCreate_productType_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface ProductTypeCreate_productTypeCreate_productType_productAttributes {
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

export interface ProductTypeCreate_productTypeCreate_productType_variantAttributes {
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

export interface ProductTypeCreate_productTypeCreate_productType_weight {
  __typename: "Weight";
  unit: WeightUnitsEnum;
  value: number;
}

export interface ProductTypeCreate_productTypeCreate_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: ProductTypeCreate_productTypeCreate_productType_taxType | null;
  metadata: (ProductTypeCreate_productTypeCreate_productType_metadata | null)[];
  privateMetadata: (ProductTypeCreate_productTypeCreate_productType_privateMetadata | null)[];
  productAttributes: (ProductTypeCreate_productTypeCreate_productType_productAttributes | null)[] | null;
  variantAttributes: (ProductTypeCreate_productTypeCreate_productType_variantAttributes | null)[] | null;
  weight: ProductTypeCreate_productTypeCreate_productType_weight | null;
}

export interface ProductTypeCreate_productTypeCreate {
  __typename: "ProductTypeCreate";
  errors: ProductTypeCreate_productTypeCreate_errors[];
  productType: ProductTypeCreate_productTypeCreate_productType | null;
}

export interface ProductTypeCreate {
  productTypeCreate: ProductTypeCreate_productTypeCreate | null;
}

export interface ProductTypeCreateVariables {
  input: ProductTypeInput;
}
