import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell, TableHead } from "@dashboard/components/Table/Table";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination/TablePaginationWithContext";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import { type WarehouseWithShippingFragment } from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import { renderCollection } from "@dashboard/misc";
import { type ListProps, type SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getArrowDirection } from "@dashboard/utils/sort";
import { messages } from "@dashboard/warehouses/messages";
import { WarehouseListUrlSortField, warehousePath } from "@dashboard/warehouses/urls";
import { warehousePickupListLabel } from "@dashboard/warehouses/warehousePickupListLabel";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import styles from "./WarehouseList.module.css";

export type WarehouseListSecondaryColumn = "loading" | "zones" | "pickup";

interface WarehouseListProps extends ListProps, SortPage<WarehouseListUrlSortField> {
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
  /**
   * Direct stock mode shows pickup. Legacy mode shows shipping zones.
   * Loading keeps the cell empty until the shop setting is known.
   */
  secondaryColumn?: WarehouseListSecondaryColumn;
  /** Optional search configuration */
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
  };
}

const numberOfColumns = 3;

export const WarehouseList = ({
  warehouses,
  disabled,
  settings,
  sort,
  onUpdateListSettings,
  onRemove,
  onSort,
  search,
  secondaryColumn = "zones",
}: WarehouseListProps): ReactNode => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <ResponsiveTable
      data-test-id="warehouse-list"
      search={search}
      footer={
        <TablePaginationWithContext
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      }
    >
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            direction={
              sort.sort === WarehouseListUrlSortField.name
                ? getArrowDirection(!!sort.asc)
                : undefined
            }
            arrowPosition="right"
            className={styles.colName}
            onClick={() => onSort(WarehouseListUrlSortField.name)}
          >
            <FormattedMessage id="aCJwVq" defaultMessage="Name" description="warehouse" />
          </TableCellHeader>
          <TableCell className={styles.colSecondary}>
            {secondaryColumn === "loading" ? (
              <Skeleton __width="5rem" __height="1rem" />
            ) : secondaryColumn === "pickup" ? (
              <FormattedMessage {...messages.pickupColumn} />
            ) : (
              <FormattedMessage {...messages.shippingZonesColumn} />
            )}
          </TableCell>
          <TableCell />
        </TableRowLink>
      </TableHead>
      <TableBody data-test-id="warehouses-list">
        {renderCollection(
          warehouses,
          warehouse => (
            <TableRowLink
              href={
                warehouse
                  ? {
                      pathname: warehousePath(encodeURIComponent(warehouse.id)),
                      state: getPrevLocationState(location),
                    }
                  : undefined
              }
              className={styles.tableRow}
              hover={!!warehouse}
              key={warehouse ? warehouse.id : "skeleton"}
              data-test-id={"warehouse-entry-" + warehouse?.name.toLowerCase().replace(" ", "")}
            >
              <TableCell className={styles.colName} data-test-id="name">
                {warehouse?.name ?? <Skeleton />}
              </TableCell>
              <TableCell className={styles.colSecondary} data-test-id="zones">
                {secondaryColumn === "loading" || warehouse === undefined ? (
                  <Skeleton />
                ) : secondaryColumn === "pickup" ? (
                  intl.formatMessage(warehousePickupListLabel(warehouse.clickAndCollectOption))
                ) : (
                  mapEdgesToItems(warehouse.shippingZones)
                    ?.map(({ name }) => name)
                    .join(", ") || "-"
                )}
              </TableCell>
              <TableCell>
                <TableButtonWrapper>
                  <Button
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                    variant="secondary"
                    data-test-id="delete-button"
                    onClick={() => onRemove(warehouse?.id)}
                    marginLeft="auto"
                  />
                </TableButtonWrapper>
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRowLink data-test-id="empty-list-message">
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="2gsiR1" defaultMessage="No warehouses found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

WarehouseList.displayName = "WarehouseList";
