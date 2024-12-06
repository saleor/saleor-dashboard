import { fuzzySearch } from "@dashboard/misc";
import { useState } from "react";

export const useChannelsSearch = function <T extends { name: string }>(channels: T[]) {
  const [query, onQueryChange] = useState("");
  const filteredChannels = fuzzySearch(channels, query, ["name"]);

  return { query, onQueryChange, filteredChannels };
};
