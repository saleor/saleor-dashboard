import { Dialog, Pagination, Sort, TabActionDialog } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export enum DiscountListUrlSortField {
  name = "name",
  endDate = "endDate",
  startDate = "startDate",
}

export type DiscountListUrlDialog = TabActionDialog;

export type DiscountListUrlSort = Sort<DiscountListUrlSortField>;

export type DiscountListUrlQueryParams = Dialog<DiscountListUrlDialog> &
  Pagination &
  DiscountListUrlSort;

export const discountListUrl = (params?: DiscountListUrlQueryParams) =>
  "/discounts/sales" + "?" + stringifyQs(params);

export const discountUrl = (id: string, params?: DiscountListUrlQueryParams) =>
  urlJoin("/discounts/sales", id) + "?" + stringifyQs(params);

export const discountAddUrl = () => "/discounts/sales/add";
