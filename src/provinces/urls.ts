import { ActiveTab, BulkAction, Pagination } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";

export const provincesSection = "/provinces/";
export const provincesListPath = provincesSection;

export type ProvincesListUrlQueryParams = ActiveTab & BulkAction & Pagination;
export const provincesListUrl = (params?: ProvincesListUrlQueryParams) =>
  provincesListPath + "?" + stringifyQs(params);
