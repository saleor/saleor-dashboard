import { ProductListUrlFiltersAsDictWithMultipleValues } from "@dashboard/products/urls";

export const ProductFilterKeys = {
  ...ProductListUrlFiltersAsDictWithMultipleValues,
  categories: "categories",
  collections: "collections",
  metadata: "metadata",
  price: "price",
  productType: "productType",
  stock: "stock",
  channel: "channel",
  productKind: "productKind",
} as const;

export type ProductFilterKeys = (typeof ProductFilterKeys)[keyof typeof ProductFilterKeys];
