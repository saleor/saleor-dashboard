import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { type Dialog, type Filters, type SingleAction, type Sort } from "../types";

enum ChannelsListUrlFiltersEnum {
  query = "query",
}
export enum ChannelsListUrlSortField {
  name = "name",
  status = "status",
}
type ChannelsListUrlSort = Sort<ChannelsListUrlSortField>;
type ChannelsListUrlFilters = Filters<ChannelsListUrlFiltersEnum>;
export type ChannelUrlDialog =
  | "remove"
  | "setup"
  | "duplicate"
  | "create-warehouse"
  | "create-shipping"
  | "assign-warehouse"
  | "assign-shipping"
  | "activate"
  | "deactivate"
  | "view-metadata"
  | "bulk-publish";
export type ChannelUrlQueryParams = Dialog<ChannelUrlDialog>;
export type ChannelsListUrlDialog = "remove" | "create";
export type ChannelsListUrlQueryParams = Dialog<ChannelsListUrlDialog> &
  ChannelsListUrlFilters &
  ChannelsListUrlSort &
  SingleAction &
  Partial<{
    /** Source channel id when opening create as a duplicate. */
    from: string;
  }>;

export type ChannelsAction = "open-channels-picker";

export const channelsSection = "/channels/";

export const channelsListPath = channelsSection;

export const channelsListUrl = (params?: ChannelsListUrlQueryParams) =>
  channelsListPath + "?" + stringifyQs(params);

/** Opens the create-channel dialog on the channels list. */
export const channelCreateUrl = (options?: { from?: string }) =>
  channelsListUrl({
    action: "create",
    ...(options?.from ? { from: options.from } : {}),
  });

/** Legacy create path — redirects to {@link channelCreateUrl}. */
export const channelAddPath = urlJoin(channelsSection, "add");
export const channelAddUrl = channelAddPath;

export const channelPath = (id: string) => urlJoin(channelsSection, id);

export const channelUrl = (id: string, params?: ChannelUrlQueryParams) =>
  channelPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
