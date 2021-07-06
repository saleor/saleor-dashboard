/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeInputTypeEnum, AttributeEntityTypeEnum, MeasurementUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductType
// ====================================================

export interface ProductType_productType_productAttributes_choices_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ProductType_productType_productAttributes_choices_edges_node_file {
  __typename: "File";
  url: string;
  contentType: string | null;
}

export interface ProductType_productType_productAttributes_choices_edges_node {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
  file: ProductType_productType_productAttributes_choices_edges_node_file | null;
  reference: string | null;
  richText: any | null;
  boolean: boolean | null;
}

export interface ProductType_productType_productAttributes_choices_edges {
  __typename: "AttributeValueCountableEdge";
  cursor: string;
  node: ProductType_productType_productAttributes_choices_edges_node;
}

export interface ProductType_productType_productAttributes_choices {
  __typename: "AttributeValueCountableConnection";
  pageInfo: ProductType_productType_productAttributes_choices_pageInfo;
  edges: ProductType_productType_productAttributes_choices_edges[];
}

export interface ProductType_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  inputType: AttributeInputTypeEnum | null;
  entityType: AttributeEntityTypeEnum | null;
  slug: string | null;
  name: string | null;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null;
  choices: ProductType_productType_productAttributes_choices | null;
}

export interface ProductType_productType_taxType {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface ProductType_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
  productAttributes: (ProductType_productType_productAttributes | null)[] | null;
  taxType: ProductType_productType_taxType | null;
}

export interface ProductType {
  productType: ProductType_productType | null;
}

export interface ProductTypeVariables {
  id: string;
  firstValues?: number | null;
  afterValues?: string | null;
  lastValues?: number | null;
  beforeValues?: string | null;
}
