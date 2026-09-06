import { useQuery } from "@apollo/client";
import { type ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/constants";
import { readModelTypeIcon } from "@dashboard/components/ModelTypeIcon/getModelTypeIcon";
import { type PinnedModelTypeFragment } from "@dashboard/graphql";
import { useEffect, useMemo, useState } from "react";

import {
  buildPinnedModelTypesDocument,
  buildPinnedModelTypesVariables,
  getAliasForIndex,
} from "../buildPinnedModelTypesDocument";
import { readModelTypeNamesSnapshot, writeModelTypeNamesSnapshot } from "../snapshotStorage";

/** One alias per pinned id; a deleted model type resolves to `null` without failing the query. */
type PinnedModelTypesResult = Record<string, PinnedModelTypeFragment | null>;

interface PinnedModelTypeNamesResult {
  names: Record<string, string>;
  /**
   * Live-only: icons are not snapshotted because the icon itself resolves through a lazy import,
   * so the first frame renders the fallback either way.
   */
  icons: Record<string, ModelTypeIcon>;
  /** Live query has settled (or there is nothing to fetch). Distinguishes loading from missing. */
  hasResolved: boolean;
}

/**
 * Resolves pinned model type ids to their names. Ids that no longer resolve are simply absent
 * from the result, which is how deleted model types drop out of the sidebar — no orphan sweep.
 */
export const usePinnedModelTypeNames = (ids: readonly string[]): PinnedModelTypeNamesResult => {
  const key = [...new Set(ids)].sort().join(",");
  // Memoised on the id set: a fresh document object every render would defeat Apollo's dedup.
  const uniqueIds = useMemo(() => (key === "" ? [] : key.split(",")), [key]);

  const document = useMemo(() => buildPinnedModelTypesDocument(uniqueIds), [uniqueIds]);
  const variables = useMemo(() => buildPinnedModelTypesVariables(uniqueIds), [uniqueIds]);

  const [snapshot] = useState(() => readModelTypeNamesSnapshot());

  const { data } = useQuery<PinnedModelTypesResult>(document, {
    variables,
    skip: uniqueIds.length === 0,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const live = useMemo(() => {
    if (!data) {
      return null;
    }

    return uniqueIds.reduce<Pick<PinnedModelTypeNamesResult, "names" | "icons">>(
      (acc, id, index) => {
        const node = data[getAliasForIndex(index)];

        if (!node) {
          return acc;
        }

        const icon = readModelTypeIcon(node.metadata);

        return {
          names: { ...acc.names, [id]: node.name },
          icons: icon ? { ...acc.icons, [id]: icon } : acc.icons,
        };
      },
      { names: {}, icons: {} },
    );
  }, [data, uniqueIds]);

  useEffect(() => {
    if (live) {
      writeModelTypeNamesSnapshot(live.names);
    }
  }, [live]);

  return {
    names: live?.names ?? snapshot ?? {},
    icons: live?.icons ?? {},
    hasResolved: uniqueIds.length === 0 || live !== null,
  };
};
