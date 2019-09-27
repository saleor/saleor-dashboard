import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  TabActionDialog
} from "../types";

export const serviceSection = "/services/";

export const serviceListPath = serviceSection;
export enum ServiceListUrlFiltersEnum {
  query = "query"
}
export type ServiceListUrlFilters = Filters<ServiceListUrlFiltersEnum>;
export type ServiceListUrlDialog = "remove" | TabActionDialog;
export type ServiceListUrlQueryParams = ActiveTab &
  ServiceListUrlFilters &
  Dialog<ServiceListUrlDialog> &
  Pagination &
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
