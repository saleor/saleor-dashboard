import { type DocumentNode, NetworkStatus } from "@apollo/client";
import { useQuery } from "@dashboard/hooks/graphql";
import { useState } from "react";

export interface MetadataDialogDataOptions<TData, TVariables, TEntity> {
  query: DocumentNode;
  variables?: TVariables;
  /** Picks the edited object from the query result; `null` or `undefined` means it wasn't found. */
  select: (data: TData) => TEntity | null | undefined;
}

interface MetadataDialogData<TEntity> {
  entity: TEntity | undefined;
  contentLoading: boolean;
  loadError: boolean;
  onRetryLoad: () => void;
}

/**
 * Loads the metadata a dialog edits. Use it in a component that is mounted only while the dialog
 * is open, so every open starts a new, network-only request.
 *
 * Until a request in this open succeeds, nothing is shown: Apollo can hand back an earlier result
 * or cached data while loading and even after a failed request, which must not pass for current.
 * After that, a reload (after a save, or Retry) keeps the last good result on screen.
 */
export const useMetadataDialogData = <TData, TVariables, TEntity>({
  query,
  variables,
  select,
}: MetadataDialogDataOptions<TData, TVariables, TEntity>): MetadataDialogData<TEntity> => {
  const { data, error, networkStatus, refetch } = useQuery<TData, TVariables>(query, {
    variables,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    // The dialog shows a failed load itself, with Retry, so no toast on top of it. A failed
    // reload after a save keeps the saved metadata on screen and the save confirmed.
    handleError: () => undefined,
  });
  const requestRunning = networkStatus < NetworkStatus.ready;
  const succeededData = !requestRunning && !error ? data : undefined;
  // The last successful result of this open, kept while a reload runs or after it fails.
  const [lastGoodData, setLastGoodData] = useState<TData | undefined>(undefined);

  if (succeededData && succeededData !== lastGoodData) {
    setLastGoodData(succeededData);
  }

  const shownData = succeededData ?? lastGoodData;
  const entity = shownData ? (select(shownData) ?? undefined) : undefined;
  const loadError = !requestRunning && !entity;

  return {
    entity,
    contentLoading: !entity && !loadError,
    loadError,
    onRetryLoad: () => {
      // A failed retry shows the load error again.
      refetch().catch(() => undefined);
    },
  };
};
