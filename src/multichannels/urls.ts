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

export const channelsListUrl = () => channelsListPath;

export const channelAddPath = urlJoin(channelsSection, "add");
export const channelAddUrl = channelAddPath;
