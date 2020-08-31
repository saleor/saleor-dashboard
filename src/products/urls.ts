import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersAsDictWithMultipleValues,
  FiltersWithMultipleValues,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog
} from "../types";
import { stringifyQs } from "../utils/urls";

const productSection = "/products/";

export const productAddPath = urlJoin(productSection, "add");
export const productAddUrl = productAddPath;

export const productListPath = productSection;
export type ProductListUrlDialog =
  | "publish"
  | "unpublish"
  | "delete"
  | "export"
  | TabActionDialog;
export enum ProductListUrlFiltersEnum {
  priceFrom = "priceFrom",
  priceTo = "priceTo",
  status = "status",
  stockStatus = "stockStatus",
  query = "query"
}
export enum ProductListUrlFiltersWithMultipleValues {
  categories = "categories",
  collections = "collections",
  productTypes = "productTypes"
}
export enum ProductListUrlFiltersAsDictWithMultipleValues {
  attributes = "attributes"
}
export type ProductListUrlFilters = Filters<ProductListUrlFiltersEnum> &
  FiltersWithMultipleValues<ProductListUrlFiltersWithMultipleValues> &
  FiltersAsDictWithMultipleValues<
    ProductListUrlFiltersAsDictWithMultipleValues
  >;
export enum ProductListUrlSortField {
  attribute = "attribute",
  name = "name",
  productType = "productType",
  status = "status",
  price = "price"
}
export type ProductListUrlSort = Sort<ProductListUrlSortField>;
export interface ProductListUrlQueryParams
  extends BulkAction,
    Dialog<ProductListUrlDialog>,
    ProductListUrlFilters,
    ProductListUrlSort,
    Pagination,
    ActiveTab {
  attributeId?: string;
}
export const productListUrl = (params?: ProductListUrlQueryParams): string =>
  productListPath + "?" + stringifyQs(params);

export const productPath = (id: string) => urlJoin(productSection + id);
export type ProductUrlDialog = "remove" | "remove-variants";
export type ProductUrlQueryParams = BulkAction & Dialog<ProductUrlDialog>;
export const productUrl = (id: string, params?: ProductUrlQueryParams) =>
  productPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const productVariantEditPath = (productId: string, variantId: string) =>
  urlJoin(productSection, productId, "variant", variantId);
export type ProductVariantEditUrlDialog =
  | "remove"
  | "assign-attribute"
  | "unassign-attribute"
  | "unassign-attributes";
export type ProductVariantEditUrlQueryParams = Dialog<
  ProductVariantEditUrlDialog
> &
  BulkAction &
  SingleAction & {
    type?: string;
  };
export const productVariantEditUrl = (
  productId: string,
  variantId: string,
  params?: ProductVariantEditUrlQueryParams
) =>
  productVariantEditPath(
    encodeURIComponent(productId),
    encodeURIComponent(variantId)
  ) +
  "?" +
  stringifyQs(params);

export const productVariantCreatorPath = (productId: string) =>
  urlJoin(productSection, productId, "variant-creator");
export const productVariantCreatorUrl = (productId: string) =>
  productVariantCreatorPath(encodeURIComponent(productId));

export const productVariantAddPath = (productId: string) =>
  urlJoin(productSection, productId, "variant/add");
export const productVariantAddUrl = (productId: string): string =>
  productVariantAddPath(encodeURIComponent(productId));

export const productImagePath = (productId: string, imageId: string) =>
  urlJoin(productSection, productId, "image", imageId);
export type ProductImageUrlDialog = "remove";
export type ProductImageUrlQueryParams = Dialog<"remove">;
export const productImageUrl = (
  productId: string,
  imageId: string,
  params?: ProductImageUrlQueryParams
) =>
  productImagePath(encodeURIComponent(productId), encodeURIComponent(imageId)) +
  "?" +
  stringifyQs(params);
