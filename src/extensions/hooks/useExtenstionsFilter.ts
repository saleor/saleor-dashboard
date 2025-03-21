import { ExtensionsGroups } from "@dashboard/extensions/types";
import { fuzzySearch } from "@dashboard/misc";
import { useState } from "react";

export const useExtensionsFilter = ({ extensions }: { extensions: ExtensionsGroups }) => {
  const [query, setQuery] = useState("");

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const filteredExtensions = Object.fromEntries(
    Object.entries(extensions).map(([key, value]) => [key, fuzzySearch(value, query, ["name"])]),
  ) as ExtensionsGroups;

  return {
    query,
    handleQueryChange,
    filteredExtensions,
  };
};
