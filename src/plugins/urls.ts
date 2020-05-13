import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog
} from "../types";

export const pluginSection = "/plugins/";

export const pluginListPath = pluginSection;
export enum PluginListUrlFiltersEnum {
  active = "active",
  query = "query"
}
export type PluginListUrlFilters = Filters<PluginListUrlFiltersEnum>;
export type PluginListUrlDialog = TabActionDialog;
export enum PluginListUrlSortField {
  name = "name",
  active = "active"
}
export type PluginListUrlSort = Sort<PluginListUrlSortField>;
export type PluginListUrlQueryParams = ActiveTab &
  Dialog<PluginListUrlDialog> &
  PluginListUrlFilters &
  Pagination &
  PluginListUrlSort &
  SingleAction;
export const pluginListUrl = (params?: PluginListUrlQueryParams) =>
  pluginListPath + "?" + stringifyQs(params);

export const pluginPath = (id: string) => urlJoin(pluginSection, id);
export type PluginUrlDialog = "clear" | "edit";
export type PluginUrlQueryParams = Dialog<PluginUrlDialog> & SingleAction;
export const pluginUrl = (id: string, params?: PluginUrlQueryParams) =>
  pluginPath(encodeURIComponent(id)) + "/?" + stringifyQs(params);
