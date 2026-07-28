import { fuzzySearch } from "@dashboard/misc";
import isEqual from "lodash/isEqual";
import { useState } from "react";

export const areSelectedChannelIdsEqual = (selectedIds: string[], baselineIds: string[]) =>
  isEqual([...selectedIds].sort(), [...baselineIds].sort());

export const useChannelsSearch = function <T extends { name: string }>(channels: T[]) {
  const [query, setQuery] = useState("");
  const filteredChannels = fuzzySearch(channels, query, ["name"]) ?? [];

  return {
    query,
    onQueryChange: setQuery,
    resetQuery: () => setQuery(""),
    filteredChannels,
  };
};
