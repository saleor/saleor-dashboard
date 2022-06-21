import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { WarehouseWithShippingFragment } from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps, SortPage } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getArrowDirection } from "@saleor/utils/sort";
import {
  WarehouseListUrlSortField,
  warehouseUrl,
} from "@saleor/warehouses/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 160,
      },
      colName: {
        width: 400,
      },
      colZones: {
        width: "auto",
      },
    },
    actions: {
      alignItems: "center",
      display: "flex",
      justifyContent: "flex-end",
      position: "relative",
      right: theme.spacing(-1.5),
    },
    colActions: {
      textAlign: "right",
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

interface WarehouseListProps
  extends ListProps,
    SortPage<WarehouseListUrlSortField> {
  warehouses: WarehouseWithShippingFragment[];
  onRemove: (id: string) => void;
}

const numberOfColumns = 3;

const WarehouseList: React.FC<WarehouseListProps> = props => {
  const {
    warehouses,
    disabled,
    settings,
    sort,
    onUpdateListSettings,
    onRemove,
    onSort,
  } = props;

  const classes = useStyles(props);

  return (
    <ResponsiveTable data-test-id="warehouse-list">
      <TableHead>
        <TableRow>
          <TableCellHeader
            direction={
              sort.sort === WarehouseListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            className={classes.colName}
            onClick={() => onSort(WarehouseListUrlSortField.name)}
          >
            <FormattedMessage
              id="aCJwVq"
              defaultMessage="Name"
              description="warehouse"
            />
          </TableCellHeader>
          <TableCell className={classes.colZones}>
            <FormattedMessage id="PFXGaR" defaultMessage="Shipping Zones" />
          </TableCell>
          <TableCell className={classes.colActions}>
            <FormattedMessage id="wL7VAE" defaultMessage="Actions" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          warehouses,
          warehouse => (
            <TableRowLink
              href={warehouse && warehouseUrl(warehouse.id)}
              className={classes.tableRow}
              hover={!!warehouse}
              key={warehouse ? warehouse.id : "skeleton"}
              data-test-id={
                "warehouse-entry-" +
                warehouse?.name.toLowerCase().replace(" ", "")
              }
            >
              <TableCell className={classes.colName} data-test-id="name">
                {maybe<React.ReactNode>(() => warehouse.name, <Skeleton />)}
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
              <TableCell className={classes.colActions}>
                <div className={classes.actions}>
                  <IconButton
                    variant="secondary"
                    color="primary"
                    data-test-id="edit-button"
                  >
                    <EditIcon />
                  </IconButton>
                  <TableButtonWrapper>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={stopPropagation(() => onRemove(warehouse.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableButtonWrapper>
                </div>
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRow data-test-id="empty-list-message">
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="2gsiR1"
                  defaultMessage="No warehouses found"
                />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

WarehouseList.displayName = "WarehouseList";
export default WarehouseList;
