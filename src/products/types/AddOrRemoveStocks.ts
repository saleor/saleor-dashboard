/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StockInput, ProductErrorCode, StockErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AddOrRemoveStocks
// ====================================================

export interface AddOrRemoveStocks_productVariantStocksCreate_errors {
  __typename: "BulkStockError";
  code: ProductErrorCode;
  field: string | null;
  index: number | null;
}

export interface AddOrRemoveStocks_productVariantStocksCreate_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface AddOrRemoveStocks_productVariantStocksCreate_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: AddOrRemoveStocks_productVariantStocksCreate_productVariant_stocks_warehouse;
}

export interface AddOrRemoveStocks_productVariantStocksCreate_productVariant {
  __typename: "ProductVariant";
  id: string;
  stocks: (AddOrRemoveStocks_productVariantStocksCreate_productVariant_stocks | null)[] | null;
}

export interface AddOrRemoveStocks_productVariantStocksCreate {
  __typename: "ProductVariantStocksCreate";
  errors: AddOrRemoveStocks_productVariantStocksCreate_errors[];
  productVariant: AddOrRemoveStocks_productVariantStocksCreate_productVariant | null;
}

export interface AddOrRemoveStocks_productVariantStocksDelete_errors {
  __typename: "StockError";
  code: StockErrorCode;
  field: string | null;
}

export interface AddOrRemoveStocks_productVariantStocksDelete_productVariant_stocks_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface AddOrRemoveStocks_productVariantStocksDelete_productVariant_stocks {
  __typename: "Stock";
  id: string;
  quantity: number;
  quantityAllocated: number;
  warehouse: AddOrRemoveStocks_productVariantStocksDelete_productVariant_stocks_warehouse;
}

export interface AddOrRemoveStocks_productVariantStocksDelete_productVariant {
  __typename: "ProductVariant";
  id: string;
  stocks: (AddOrRemoveStocks_productVariantStocksDelete_productVariant_stocks | null)[] | null;
}

export interface AddOrRemoveStocks_productVariantStocksDelete {
  __typename: "ProductVariantStocksDelete";
  errors: AddOrRemoveStocks_productVariantStocksDelete_errors[];
  productVariant: AddOrRemoveStocks_productVariantStocksDelete_productVariant | null;
}

export interface AddOrRemoveStocks {
  productVariantStocksCreate: AddOrRemoveStocks_productVariantStocksCreate | null;
  productVariantStocksDelete: AddOrRemoveStocks_productVariantStocksDelete | null;
}

export interface AddOrRemoveStocksVariables {
  variantId: string;
  add: StockInput[];
  remove: string[];
}
