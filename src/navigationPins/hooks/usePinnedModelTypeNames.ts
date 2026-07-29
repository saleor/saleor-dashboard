import { useQuery } from "@apollo/client";
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

/**
 * Resolves pinned model type ids to their names. Ids that no longer resolve are simply absent
 * from the result, which is how deleted model types drop out of the sidebar — no orphan sweep.
 */
export const usePinnedModelTypeNames = (ids: readonly string[]): Record<string, string> => {
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

  const liveNames = useMemo(() => {
    if (!data) {
      return null;
    }

    return uniqueIds.reduce<Record<string, string>>((acc, id, index) => {
      const node = data[getAliasForIndex(index)];

      return node ? { ...acc, [id]: node.name } : acc;
    }, {});
  }, [data, uniqueIds]);

  useEffect(() => {
    if (liveNames) {
      writeModelTypeNamesSnapshot(liveNames);
    }
  }, [liveNames]);

  return liveNames ?? snapshot ?? {};
};
