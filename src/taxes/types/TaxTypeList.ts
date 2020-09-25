/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TaxTypeList
// ====================================================

export interface TaxTypeList_taxTypes {
  __typename: "TaxType";
  description: string | null;
  taxCode: string | null;
}

export interface TaxTypeList {
  taxTypes: (TaxTypeList_taxTypes | null)[] | null;
}
