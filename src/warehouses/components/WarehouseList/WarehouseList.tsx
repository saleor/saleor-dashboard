import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Pill } from "@dashboard/components/Pill/Pill";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell, TableHead } from "@dashboard/components/Table/Table";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination/TablePaginationWithContext";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import {
  WarehouseClickAndCollectOptionEnum,
  type WarehouseWithShippingFragment,
} from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import { renderCollection } from "@dashboard/misc";
import { type ListProps, type SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getArrowDirection } from "@dashboard/utils/sort";
import messages from "@dashboard/warehouses/components/WarehouseSettings/messages";
import { WarehouseListUrlSortField, warehousePath } from "@dashboard/warehouses/urls";
import { makeStyles } from "@saleor/macaw-ui";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import styles from "./WarehouseList.module.css";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 160,
      },
      colName: {
        width: 400,
      },
      colPickup: {
        width: 140,
      },
      colZones: {
        width: "auto",
      },
    },
    colName: {
      paddingLeft: 0,
    },
    colZones: {
      paddingLeft: 0,
    },
    tableRow: {
      cursor: "pointer",
    },
  }),
  { name: "WarehouseList" },
);

interface WarehouseListProps extends ListProps, SortPage<WarehouseListUrlSortField> {
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
  /** Optional search configuration */
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
  };
}

const pickupOptions = [
  WarehouseClickAndCollectOptionEnum.LOCAL,
  WarehouseClickAndCollectOptionEnum.ALL,
];

const isPickupLocation = (option: WarehouseClickAndCollectOptionEnum | null | undefined): boolean =>
  !!option && pickupOptions.includes(option);

const numberOfColumns = 4;
const WarehouseList = (props: WarehouseListProps) => {
  const { warehouses, disabled, settings, sort, onUpdateListSettings, onRemove, onSort, search } =
    props;
  const classes = useStyles(props);
  const location = useLocation();
  const intl = useIntl();

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
            className={classes.colName}
            onClick={() => onSort(WarehouseListUrlSortField.name)}
          >
            <FormattedMessage id="aCJwVq" defaultMessage="Name" description="warehouse" />
          </TableCellHeader>
          <TableCell className={classes.colPickup}>
            <FormattedMessage {...messages.warehouseSettingsPickupTitle} />
          </TableCell>
          <TableCell className={classes.colZones}>
            <FormattedMessage id="PFXGaR" defaultMessage="Shipping Zones" />
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
              className={classes.tableRow}
              hover={!!warehouse}
              key={warehouse ? warehouse.id : "skeleton"}
              data-test-id={"warehouse-entry-" + warehouse?.name.toLowerCase().replace(" ", "")}
            >
              <TableCell className={classes.colName} data-test-id="name">
                {warehouse?.name ?? <Skeleton />}
              </TableCell>
              <TableCell data-test-id="pickup">
                {warehouse === undefined ? (
                  <Skeleton />
                ) : isPickupLocation(warehouse.clickAndCollectOption) ? (
                  <Pill
                    className={styles.pickupPill}
                    color="info"
                    label={intl.formatMessage(messages.warehouseSettingsPickupTitle)}
                    data-test-id="warehouse-pickup-label"
                  />
                ) : null}
              </TableCell>
              <TableCell className={classes.colZones} data-test-id="zones">
                {warehouse?.shippingZones === undefined ? (
                  <Skeleton />
                ) : (
                  mapEdgesToItems(warehouse?.shippingZones)
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
export default WarehouseList;
