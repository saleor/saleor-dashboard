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
        .filter(byColumnsInSettingsOrStaticColumns(settings))
        .map(toCurrentColumnData(sort, attributeColumns)),
      ...settings.columns
        .filter(byNewAddedColumns(prevColumns))
        .map(
          toNewAddedColumData(
            [...initialColumns.current, ...attributeColumns],
            sort,
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

  return { columns, setColumns };
};

function byNewAddedColumns(currentColumns: AvailableColumn[]) {
  return (column: ProductListColumns) =>
    !currentColumns.find(c => c.id === column);
}

function byColumnsInSettingsOrStaticColumns(
  settings: ListSettings<ProductListColumns>,
) {
  return (column: AvailableColumn) =>
    settings.columns.includes(column.id as ProductListColumns) ||
    ["name"].includes(column.id);
}

function toCurrentColumnData(
  sort: Sort<ProductListUrlSortField>,
  attributeColumns: AvailableColumn[],
) {
  return (column: AvailableColumn) => {
    // Take newest attibutes data from attributeColumns
    if (column.id.startsWith("attribute")) {
      return attributeColumns.find(ac => ac.id === column.id);
    }

    return {
      ...column,
      icon: getColumnSortDirectionIcon(sort, column.id),
    };
  };
}

function toNewAddedColumData(
  columnSource: AvailableColumn[],
  sort: Sort<ProductListUrlSortField>,
) {
  return (column: ProductListColumns) => ({
    ...columnSource.find(ac => ac.id === column),
    icon: getColumnSortDirectionIcon(sort, column as ProductListUrlSortField),
  });
}
