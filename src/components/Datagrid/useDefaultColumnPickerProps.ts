import { useCallback, useMemo, useState } from "react";

import { AvailableColumn } from "./types";

export const useDefaultColumnPickerProps = (
  availableColumns: readonly AvailableColumn[],
) => {
  const [columns, setColumns] = useState(availableColumns);
  const [query, setQuery] = useState("");

  const columnChoices = columns.map(({ id, title }) => ({
    label: title,
    value: id,
  }));

  const availableColumnsChoices = useMemo(
    () =>
      availableColumns.map(({ id, title }) => ({
        label: title,
        value: id,
      })),
    [availableColumns],
  );

  const defaultColumns = availableColumns.map(({ id }) => id);

  const onColumnsChange = useCallback(
    (picked: string[]) =>
      setColumns(prevColumns => [
        ...prevColumns.filter(column => picked.includes(column.id)),
        ...picked
          .filter(column => !prevColumns.find(c => c.id === column))
          .map(column => availableColumns.find(ac => ac.id === column)),
      ]),
    [availableColumns],
  );

  return {
    query,
    onQueryChange: setQuery,
    hasMore: false,
    loading: false,
    onFetchMore: () => undefined,
    onSave: onColumnsChange,
    availableColumns: availableColumnsChoices,
    defaultColumns,
    initialColumns: columnChoices,
  };
};
