/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StockFragment
// ====================================================

export interface StockFragment_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface StockFragment {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: StockFragment_warehouse;
}
