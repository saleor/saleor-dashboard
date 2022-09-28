import { ChannelsAction } from "@saleor/channels/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersAsDictWithMultipleValues,
  FiltersWithKeyValueValues,
  FiltersWithMultipleValues,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";
import { stringifyQs } from "../utils/urls";

const productSection = "/products/";

export const productAddPath = urlJoin(productSection, "add");
export const productAddUrl = (params?: ProductCreateUrlQueryParams) =>
  productAddPath + "?" + stringifyQs(params);

export const productListPath = productSection;
export type ProductListUrlDialog =
  | "delete"
  | "export"
  | "create-product"
  | TabActionDialog;
export enum ProductListUrlFiltersEnum {
  priceFrom = "priceFrom",
  priceTo = "priceTo",
  status = "status",
  stockStatus = "stockStatus",
  query = "query",
  channel = "channel",
  productKind = "productKind",
}
export enum ProductListUrlFiltersWithMultipleValues {
  categories = "categories",
  collections = "collections",
  productTypes = "productTypes",
}
export enum ProductListUrlFiltersAsDictWithMultipleValues {
  attributes = "attributes",
}
export enum ProductListUrlFiltersWithKeyValueValues {
  metadata = "metadata",
}
export type ProductListUrlFilters = Filters<ProductListUrlFiltersEnum> &
  FiltersWithMultipleValues<ProductListUrlFiltersWithMultipleValues> &
  FiltersWithKeyValueValues<ProductListUrlFiltersWithKeyValueValues> &
  FiltersAsDictWithMultipleValues<
    ProductListUrlFiltersAsDictWithMultipleValues
  >;
export enum ProductListUrlSortField {
  attribute = "attribute",
  name = "name",
  productType = "productType",
  status = "status",
  price = "price",
  rank = "rank",
  date = "date",
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
export type ProductUrlDialog =
  | "remove"
  | "remove-variants"
  | "assign-attribute-value"
  | ChannelsAction;
export type ProductUrlQueryParams = BulkAction &
  Dialog<ProductUrlDialog> &
  SingleAction;
export type ProductCreateUrlDialog = "assign-attribute-value" | ChannelsAction;
export interface ProductCreateUrlProductType {
  "product-type-id"?: string;
}
export type ProductCreateUrlQueryParams = Dialog<ProductCreateUrlDialog> &
  SingleAction &
  ProductCreateUrlProductType;
export const productUrl = (id: string, params?: ProductUrlQueryParams) =>
  productPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const productVariantEditPath = (productId: string, variantId: string) =>
  urlJoin(productSection, productId, "variant", variantId);
export type ProductVariantEditUrlDialog = "remove" | "assign-attribute-value";
export type ProductVariantEditUrlQueryParams = Dialog<
  ProductVariantEditUrlDialog
> &
  SingleAction;
export const productVariantEditUrl = (
  productId: string,
  variantId: string,
  params?: ProductVariantEditUrlQueryParams,
) =>
  productVariantEditPath(
    encodeURIComponent(productId),
    encodeURIComponent(variantId),
  ) +
  "?" +
  stringifyQs(params);

export type ProductVariantAddUrlDialog = "assign-attribute-value";
export type ProductVariantAddUrlQueryParams = Dialog<
  ProductVariantAddUrlDialog
> &
  SingleAction;
export const productVariantAddPath = (productId: string) =>
  urlJoin(productSection, productId, "variant/add");
export const productVariantAddUrl = (
  productId: string,
  params?: ProductVariantAddUrlQueryParams,
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
  params?: ProductImageUrlQueryParams,
) =>
  productImagePath(encodeURIComponent(productId), encodeURIComponent(imageId)) +
  "?" +
  stringifyQs(params);
