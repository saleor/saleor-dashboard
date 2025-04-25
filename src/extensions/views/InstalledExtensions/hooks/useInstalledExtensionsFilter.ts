import { InstalledExtension } from "@dashboard/extensions/types";
import { fuzzySearch } from "@dashboard/misc";
import { useState } from "react";

export const useInstalledExtensionsFilter = (installedExtensions: InstalledExtension[]) => {
  const [query, setQuery] = useState("");

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const filteredInstalledExtensions = fuzzySearch(installedExtensions, query, ["name"]);

  return {
    query,
    handleQueryChange,
    filteredInstalledExtensions,
  };
};
