import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ProductListColumns } from "@dashboard/config";
import { GridAttributesQuery } from "@dashboard/graphql";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { ListSettings, RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { getColumns, toAttributeColumnData } from "../utils";

interface UseDatagridColumnsProps {
  activeAttributeSortId: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  gridAttributesFromSettings: ProductListColumns[];
  sort: Sort<ProductListUrlSortField>;
  settings: ListSettings<ProductListColumns>;
}

export const useDatagridColumns = ({
  sort,
  gridAttributes,
  gridAttributesFromSettings,
  activeAttributeSortId,
  settings,
}: UseDatagridColumnsProps) => {
  const intl = useIntl();

  const initialColumns = useRef(
    getColumns({
      intl,
      sort,
      gridAttributes,
      gridAttributesFromSettings,
      activeAttributeSortId,
    }),
  );

  const [columns, setColumns] = useState<AvailableColumn[]>([
    initialColumns.current[0],
    initialColumns.current[1],
    ...initialColumns.current.filter(col =>
      settings.columns.includes(col.id as ProductListColumns),
    ),
  ]);

  useEffect(() => {
    const attributeColumns = gridAttributesFromSettings.map(
      toAttributeColumnData(gridAttributes, activeAttributeSortId, sort),
    );

    setColumns(prevColumns => [
      ...prevColumns
        .filter(
          column =>
            settings.columns.includes(column.id as any) ||
            ["empty", "name"].includes(column.id),
        )
        .map(column => {
          if (!column.title && column.id !== "empty") {
            return attributeColumns.find(ac => ac.id === column.id);
          }
          return column;
        }),
      ...settings.columns
        .filter(column => !prevColumns.find(c => c.id === column))
        .map(column =>
          [...initialColumns.current, ...attributeColumns].find(
            ac => ac.id === column,
          ),
        ),
    ]);
  }, [
    activeAttributeSortId,
    gridAttributes,
    gridAttributesFromSettings,
    settings,
    sort,
  ]);

  useEffect(() => {
    setColumns(columns =>
      columns.map(col => ({
        ...col,
        icon: getColumnSortDirectionIcon(sort, col.id),
      })),
    );
  }, [sort]);

  return { columns, setColumns };
};
