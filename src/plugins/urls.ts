import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { Dialog, Pagination, SingleAction } from "../types";

export const pluginsSection = "/plugins/";

export const pluginsListPath = pluginsSection;
export type PluginsListUrlQueryParams = Pagination & SingleAction;
export const pluginsListUrl = (params?: PluginsListUrlQueryParams) =>
  pluginsListPath + "?" + stringifyQs(params);

export const pluginsPath = (id: string) => urlJoin(pluginsSection, id);
export type PluginUrlDialog = "clear" | "edit";
export type PluginsUrlQueryParams = Dialog<PluginUrlDialog> & {
  field?: string;
};
export const pluginsUrl = (id: string, params?: PluginsUrlQueryParams) =>
  pluginsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
