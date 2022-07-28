import { ChannelsAction } from "@saleor/channels/urls";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersWithMultipleValues,
  Pagination,
  Sort,
  TabActionDialog,
} from "../types";

export const discountSection = "/discounts/";

export const saleSection = urlJoin(discountSection, "sales");
export const saleListPath = saleSection;
export enum SaleListUrlFiltersEnum {
  type = "type",
  startedFrom = "startedFrom",
  startedTo = "startedTo",
  query = "query",
  channel = "channel",
}
export enum SaleListUrlFiltersWithMultipleValues {
  status = "status",
}
export type SaleListUrlFilters = Filters<SaleListUrlFiltersEnum> &
  FiltersWithMultipleValues<SaleListUrlFiltersWithMultipleValues>;
export type SaleListUrlDialog = "remove" | TabActionDialog;
export enum SaleListUrlSortField {
  name = "name",
  endDate = "end-date",
  startDate = "start-date",
  type = "type",
  value = "value",
}
export type SaleListUrlSort = Sort<SaleListUrlSortField>;
export type SaleListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<SaleListUrlDialog> &
  Pagination &
  SaleListUrlFilters &
  SaleListUrlSort;
export const saleListUrl = (params?: SaleListUrlQueryParams) =>
  saleListPath + "?" + stringifyQs(params);
export const salePath = (id: string) => urlJoin(saleSection, id);
export type SaleUrlDialog =
  | "assign-category"
  | "assign-collection"
  | "assign-product"
  | "assign-variant"
  | "unassign-category"
  | "unassign-collection"
  | "unassign-product"
  | "unassign-variant"
  | "remove"
  | ChannelsAction;
export type SaleUrlQueryParams = BulkAction & Dialog<SaleUrlDialog>;
export type SaleCreateUrlQueryParams = Dialog<ChannelsAction>;
export const saleUrl = (id: string, params?: SaleUrlQueryParams) =>
  salePath(encodeURIComponent(id)) + "?" + stringifyQs(params);
export const saleAddPath = urlJoin(saleSection, "add");
export const saleAddUrl = (params?: SaleCreateUrlQueryParams) =>
  saleAddPath + "?" + stringifyQs(params);

export const voucherSection = urlJoin(discountSection, "vouchers");
export const voucherListPath = voucherSection;
export enum VoucherListUrlFiltersEnum {
  startedFrom = "startedFrom",
  startedTo = "startedTo",
  timesUsedFrom = "timesUsedFrom",
  timesUsedTo = "timesUsedTo",
  query = "query",
  channel = "channel",
}
export enum VoucherListUrlFiltersWithMultipleValues {
  status = "status",
  type = "type",
}
export type VoucherListUrlFilters = Filters<VoucherListUrlFiltersEnum> &
  FiltersWithMultipleValues<VoucherListUrlFiltersWithMultipleValues>;
export type VoucherListUrlDialog = "remove" | TabActionDialog;
export enum VoucherListUrlSortField {
  code = "code",
  endDate = "end-date",
  limit = "limit",
  minSpent = "min-spent",
  startDate = "start-date",
  type = "type",
  value = "value",
}
export type VoucherListUrlSort = Sort<VoucherListUrlSortField>;
export type VoucherListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<VoucherListUrlDialog> &
  Pagination &
  VoucherListUrlFilters &
  VoucherListUrlSort;
export const voucherListUrl = (params?: VoucherListUrlQueryParams) =>
  voucherListPath + "?" + stringifyQs(params);
export const voucherPath = (id: string) => urlJoin(voucherSection, id);
export type VoucherUrlDialog =
  | "assign-category"
  | "assign-collection"
  | "assign-country"
  | "assign-product"
  | "unassign-category"
  | "unassign-collection"
  | "unassign-product"
  | "remove"
  | ChannelsAction;
export type VoucherUrlQueryParams = BulkAction & Dialog<VoucherUrlDialog>;
export type VoucherCreateUrlQueryParams = Dialog<ChannelsAction>;
export const voucherUrl = (id: string, params?: VoucherUrlQueryParams) =>
  voucherPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
export const voucherAddPath = urlJoin(voucherSection, "add");
export const voucherAddUrl = (params?: VoucherCreateUrlQueryParams) =>
  voucherAddPath + "?" + stringifyQs(params);
