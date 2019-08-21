import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { BulkAction, Dialog, Pagination, SingleAction } from "../types";

export const pluginsSection = "/plugins/";

export const pluginsListPath = pluginsSection;
export type PluginsListUrlDialog = "remove" | "remove-many";
export type PluginsListUrlQueryParams = BulkAction &
  Dialog<PluginsListUrlDialog> &
  Pagination &
  SingleAction;
export const pluginsListUrl = (params?: PluginsListUrlQueryParams) =>
  pluginsListPath + "?" + stringifyQs(params);

export const pluginsPath = (id: string) => urlJoin(pluginsSection, id);
export type PluginsUrlDialog = "edit-item" | "remove";
export type PluginsUrlQueryParams = Dialog<PluginsUrlDialog> & SingleAction;
export const pluginsUrl = (id: string, params?: PluginsUrlQueryParams) =>
  pluginsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
