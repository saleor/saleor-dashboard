import { Dialog, Pagination, Sort, TabActionDialog } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export enum DiscountListUrlSortField {
  name = "name",
  endDate = "endDate",
  startDate = "startDate",
}

const discountSection = "/discounts/sales";

export type DiscountListUrlDialog = TabActionDialog;

type DiscountListUrlSort = Sort<DiscountListUrlSortField>;

export type DiscountListUrlQueryParams = Dialog<DiscountListUrlDialog> &
  Pagination &
  DiscountListUrlSort & {
    query?: string;
  };

type DiscountUrlDialog = "remove";
export type DiscountUrlQueryParams = Dialog<DiscountUrlDialog>;

export const discountListUrl = (params?: DiscountListUrlQueryParams) =>
  discountSection + "?" + stringifyQs(params);

export const discountUrl = (id: string, params?: DiscountListUrlQueryParams) =>
  urlJoin(discountSection, id) + "?" + stringifyQs(params);

export const discountAddUrl = () => urlJoin(discountSection, "add");
