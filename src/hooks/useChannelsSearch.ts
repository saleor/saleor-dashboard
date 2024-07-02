import { ChannelDetailsFragment } from "@dashboard/graphql";
import { fuzzySearch } from "@dashboard/misc";
import { FetchMoreProps, Search, SearchProps } from "@dashboard/types";
import React from "react";

export const useChannelsSearch = function <T extends { name: string }>(channels: T[]) {
  const [query, onQueryChange] = React.useState("");
  const filteredChannels = fuzzySearch(channels, query, ["name"]) || [];

  return { query, onQueryChange, filteredChannels };
};

export interface ChannelsWithLoadMoreProps extends FetchMoreProps, Search, SearchProps {
  channels: ChannelDetailsFragment[];
}
