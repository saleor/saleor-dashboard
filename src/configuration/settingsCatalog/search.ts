import Fuse from "fuse.js";

import { type ResolvedSettingsCatalogEntry } from "./types";

/**
 * Weighted fuzzy search over a resolved settings catalog.
 * Prefer title matches, then keywords, then description / breadcrumbs.
 */
export const searchSettingsCatalog = (
  entries: ResolvedSettingsCatalogEntry[],
  query: string | undefined,
): ResolvedSettingsCatalogEntry[] => {
  const trimmed = query?.trim();

  if (!trimmed) {
    return entries;
  }

  const fuse = new Fuse(entries, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: "title", weight: 0.4 },
      { name: "keywords", weight: 0.3 },
      { name: "description", weight: 0.15 },
      { name: "breadcrumbs", weight: 0.15 },
    ],
  });

  return fuse.search(trimmed).map(({ item }) => item);
};
