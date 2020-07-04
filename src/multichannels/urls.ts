import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { Dialog, Filters, TabActionDialog } from "../types";

export enum ChannelsListUrlFiltersEnum {
  query = "query"
}
export type ChannelsListUrlFilters = Filters<ChannelsListUrlFiltersEnum>;
export type MultichannelsListUrlDialog = "remove" | TabActionDialog;
export type MultichannelsListUrlQueryParams = Dialog<
  MultichannelsListUrlDialog
> &
  ChannelsListUrlFilters;

export const channelsSection = "/multichannels/";

export const channelsListPath = channelsSection;

export const channelsListUrl = (params?: MultichannelsListUrlQueryParams) =>
  channelsListPath + "?" + stringifyQs(params);

export const channelAddPath = urlJoin(channelsSection, "add");
export const channelAddUrl = channelAddPath;

export const channelPath = (id: string) => urlJoin(channelsSection, id);

export const channelUrl = (
  id: string,
  params?: MultichannelsListUrlQueryParams
) => channelPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
