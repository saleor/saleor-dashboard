import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  readonlyTextCell,
  statusCell,
  tagsCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor, getUserName } from "@dashboard/misc";
import {
  getStaffMemberStatusDisplay,
  isStaffInvitePending,
} from "@dashboard/staff/staffMemberStatus";
import { type StaffMember, type StaffMembers } from "@dashboard/staff/types";
import { type StaffListUrlSortField } from "@dashboard/staff/urls";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type DefaultTheme } from "@saleor/macaw-ui-next";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const staffMembersListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<StaffListUrlSortField>,
  emptyColumn: AvailableColumn,
) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 400,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.status),
      width: 180,
    },
    {
      id: "customer",
      title: intl.formatMessage(columnsMessages.customer),
      width: 160,
    },
    {
      id: "email",
      title: intl.formatMessage(columnsMessages.email),
      width: 400,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    staffMembers,
    columns,
    intl,
    currentTheme,
  }: {
    staffMembers: StaffMembers;
    columns: AvailableColumn[];
    intl: IntlShape;
    currentTheme: DefaultTheme;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: StaffMember | undefined = staffMembers[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return thumbnailCell(getUserName(rowData) ?? "", rowData?.avatar?.url ?? "", {
          cursor: "pointer",
        });
      case "status": {
        const statusDisplay = getStaffMemberStatusDisplay({
          isActive: Boolean(rowData.isActive),
          invitePending: isStaffInvitePending(rowData),
          intl,
        });

        return statusCell(statusDisplay.dot, statusDisplay.label, {
          readonly: true,
          allowOverlay: false,
          cursor: "pointer",
        });
      }
      case "customer": {
        const isCustomer = (rowData.orders?.edges.length ?? 0) > 0;

        if (!isCustomer) {
          return readonlyTextCell(PLACEHOLDER);
        }

        const label = intl.formatMessage(columnsMessages.customer);
        const color = getStatusColor({
          status: "info",
          currentTheme,
        });

        return tagsCell(
          [
            {
              tag: label,
              color: color.base,
            },
          ],
          [label],
          {
            readonly: true,
            allowOverlay: false,
            cursor: "pointer",
          },
        );
      }
      case "email":
        return readonlyTextCell(rowData?.email ?? PLACEHOLDER);
      default:
        return readonlyTextCell("");
    }
  };
