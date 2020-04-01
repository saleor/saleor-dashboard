import urlJoin from "url-join";

import { stringifyQs } from "../utils/urls";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  Sort,
  TabActionDialog,
  FiltersWithMultipleValues,
  FiltersAsDictWithMultipleValues
} from "../types";

const productSection = "/products/";

export const productAddPath = urlJoin(productSection, "add");
export type ProductAddUrlDialog = "edit-stocks";
export type ProductAddUrlQueryParams = Dialog<ProductAddUrlDialog>;
export const productAddUrl = (params?: ProductAddUrlQueryParams): string =>
  productAddPath + "?" + stringifyQs(params);

export const productListPath = productSection;
export type ProductListUrlDialog =
  | "publish"
  | "unpublish"
  | "delete"
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
export type ProductUrlDialog = "edit-stocks" | "remove" | "remove-variants";
export type ProductUrlQueryParams = BulkAction & Dialog<ProductUrlDialog>;
export const productUrl = (id: string, params?: ProductUrlQueryParams) =>
  productPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const productVariantEditPath = (productId: string, variantId: string) =>
  urlJoin(productSection, productId, "variant", variantId);
export type ProductVariantEditUrlDialog = "edit-stocks" | "remove";
export type ProductVariantEditUrlQueryParams = Dialog<
  ProductVariantEditUrlDialog
>;
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
export type ProductVariantAddUrlDialog = "edit-stocks";
export type ProductVariantAddUrlQueryParams = Dialog<
  ProductVariantAddUrlDialog
>;
export const productVariantAddUrl = (
  productId: string,
  params?: ProductVariantAddUrlQueryParams
): string =>
  productVariantAddPath(encodeURIComponent(productId)) +
  "?" +
  stringifyQs(params);

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
