import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { PermissionGroupFragment } from "@dashboard/graphql";
import { PermissionGroupListUrlSortField } from "@dashboard/permissionGroups/urls";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const permissionGroupsListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<PermissionGroupListUrlSortField>,
  emptyColumn: AvailableColumn,
) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 450,
    },
    {
      id: "members",
      title: intl.formatMessage(columnsMessages.members),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    permissionGroups,
    columns,
  }: {
    permissionGroups: PermissionGroupFragment[];
    columns: AvailableColumn[];
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: PermissionGroupFragment | undefined = permissionGroups[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData?.name ?? PLACEHOLDER);
      case "members":
        return readonlyTextCell(rowData?.users?.length?.toString() ?? PLACEHOLDER);
      default:
        return readonlyTextCell("");
    }
  };
