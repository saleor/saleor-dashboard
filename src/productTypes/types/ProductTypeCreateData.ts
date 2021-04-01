/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ProductTypeCreateData
// ====================================================

export interface ProductTypeCreateData_shop {
  __typename: "Shop";
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface ProductTypeCreateData_taxTypes {
  __typename: "TaxType";
  taxCode: string | null;
  description: string | null;
}

export interface ProductTypeCreateData {
  shop: ProductTypeCreateData_shop;
  taxTypes: (ProductTypeCreateData_taxTypes | null)[] | null;
}
