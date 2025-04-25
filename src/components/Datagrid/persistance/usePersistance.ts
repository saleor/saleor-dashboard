import { MetadataItemFragment } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { useRef } from "react";

import { byDuplicates } from "./byDuplicates";
import { PersistedColumn, RawColumn } from "./persistedColumn";
import { useMetadata } from "./useMetadata";

const parseGridMetadata = (metadata?: MetadataItemFragment) => {
  try {
    if (!metadata) return [];

    const rawColumns = JSON.parse(metadata.value) as RawColumn[];

    return rawColumns.map(col => PersistedColumn.fromRaw(col));
  } catch (_) {
    return [];
  }
};

const toRaw = (column: PersistedColumn) => column.asRaw();

export const usePersistance = (gridName?: string) => {
  const { metadata, persist } = useMetadata(gridName || "");
  const columnsState = useRef<PersistedColumn[]>(parseGridMetadata(metadata));

  const saveMetadata = useDebounce((columns: PersistedColumn[]) => {
    const rawColumns = columnsState.current.concat(columns).map(toRaw).filter(byDuplicates);

    const metadata = [{ key: `grid_${gridName}`, value: JSON.stringify(rawColumns) }];

    persist(metadata);
  }, 500);

  const update = (columns: PersistedColumn[]) => {
    if (!gridName) return;

    columnsState.current = columns;
    saveMetadata(columns);
  };

  return {
    columns: columnsState.current,
    update,
  };
};
