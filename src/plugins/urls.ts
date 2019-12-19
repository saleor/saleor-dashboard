import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { Dialog, Pagination, SingleAction, Sort } from "../types";

export const pluginSection = "/plugins/";

export const pluginListPath = pluginSection;
export enum PluginListUrlSortField {
  name = "name",
  active = "active"
}
export type PluginListUrlSort = Sort<PluginListUrlSortField>;
export type PluginListUrlQueryParams = Pagination &
  PluginListUrlSort &
  SingleAction;
export const pluginListUrl = (params?: PluginListUrlQueryParams) =>
  pluginListPath + "?" + stringifyQs(params);

export const pluginPath = (id: string) => urlJoin(pluginSection, id);
export type PluginUrlDialog = "clear" | "edit";
export type PluginUrlQueryParams = Dialog<PluginUrlDialog> & SingleAction;
export const pluginUrl = (id: string, params?: PluginUrlQueryParams) =>
  pluginPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
