import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { Dialog, Filters, SingleAction, Sort } from "../types";

export enum ChannelsListUrlFiltersEnum {
  query = "query",
}
export enum ChannelsListUrlSortField {
  name = "name",
}
export type ChannelsListUrlSort = Sort<ChannelsListUrlSortField>;
export type ChannelsListUrlFilters = Filters<ChannelsListUrlFiltersEnum>;
export type ChannelUrlDialog = "remove";
export type ChannelUrlQueryParams = Dialog<ChannelUrlDialog>;
export type ChannelsListUrlDialog = "remove";
export type ChannelsListUrlQueryParams = Dialog<ChannelsListUrlDialog> &
  ChannelsListUrlFilters &
  ChannelsListUrlSort &
  SingleAction;

export type ChannelsAction = "open-channels-picker";

export const channelsSection = "/channels/";

export const channelsListPath = channelsSection;

export const channelsListUrl = (params?: ChannelsListUrlQueryParams) =>
  channelsListPath + "?" + stringifyQs(params);

export const channelAddPath = urlJoin(channelsSection, "add");
export const channelAddUrl = channelAddPath;

export const channelPath = (id: string) => urlJoin(channelsSection, id);

export const channelUrl = (id: string, params?: ChannelsListUrlQueryParams) =>
  channelPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
