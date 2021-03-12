import { ChannelsAction } from "@saleor/channels/urls";
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
export const productAddUrl = (params?: ProductCreateUrlQueryParams) =>
  productAddPath + "?" + stringifyQs(params);

export const productListPath = productSection;
export type ProductListUrlDialog = "delete" | "export" | TabActionDialog;
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
  price = "price",
  rank = "rank"
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
export type ProductCreateUrlQueryParams = Dialog<ProductCreateUrlDialog> &
  SingleAction;
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

export type ProductVariantAddUrlDialog = "assign-attribute-value";
export type ProductVariantAddUrlQueryParams = Dialog<
  ProductVariantAddUrlDialog
> &
  SingleAction;
export const productVariantAddPath = (productId: string) =>
  urlJoin(productSection, productId, "variant/add");
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
