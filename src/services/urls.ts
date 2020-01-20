import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  TabActionDialog,
  Sort
} from "../types";

export const serviceSection = "/services/";

export const serviceListPath = serviceSection;
export enum ServiceListUrlFiltersEnum {
  active = "active",
  query = "query"
}
export type ServiceListUrlFilters = Filters<ServiceListUrlFiltersEnum>;
export type ServiceListUrlDialog = "remove" | TabActionDialog;
export enum ServiceListUrlSortField {
  name = "name",
  active = "active"
}
export type ServiceListUrlSort = Sort<ServiceListUrlSortField>;
export type ServiceListUrlQueryParams = ActiveTab &
  Dialog<ServiceListUrlDialog> &
  Pagination &
  ServiceListUrlFilters &
  ServiceListUrlSort &
  SingleAction;
export const serviceListUrl = (params?: ServiceListUrlQueryParams) =>
  serviceListPath + "?" + stringifyQs(params);

export const servicePath = (id: string) => urlJoin(serviceSection, id);
export type ServiceUrlDialog = "create-token" | "remove" | "remove-token";
export type ServiceUrlQueryParams = Dialog<ServiceUrlDialog> & SingleAction;
export const serviceUrl = (id: string, params?: ServiceUrlQueryParams) =>
  servicePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const serviceAddPath = urlJoin(serviceSection, "add");
export const serviceAddUrl = serviceAddPath;
