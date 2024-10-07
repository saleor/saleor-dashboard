import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { WarehouseWithShippingFragment } from "@dashboard/graphql";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { ListProps, SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getArrowDirection } from "@dashboard/utils/sort";
import { WarehouseListUrlSortField, warehouseUrl } from "@dashboard/warehouses/urls";
import { TableBody, TableCell, TableFooter, TableHead } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

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
      gap: theme.spacing(1),
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

interface WarehouseListProps extends ListProps, SortPage<WarehouseListUrlSortField> {
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
}

const numberOfColumns = 3;
const WarehouseList: React.FC<WarehouseListProps> = props => {
  const { warehouses, disabled, settings, sort, onUpdateListSettings, onRemove, onSort } = props;
  const classes = useStyles(props);
  const location = useLocation();

  return (
    <ResponsiveTable data-test-id="warehouse-list">
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
          <TableCell className={classes.colZones}>
            <FormattedMessage id="PFXGaR" defaultMessage="Shipping Zones" />
          </TableCell>
          <TableCell className={classes.colActions}>
            <FormattedMessage id="wL7VAE" defaultMessage="Actions" />
          </TableCell>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody data-test-id="warehouses-list">
        {renderCollection(
          warehouses,
          warehouse => (
            <TableRowLink
              href={
                warehouse
                  ? {
                      pathname: warehouseUrl(warehouse.id),
                      state: { prevLocation: location },
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
                  <IconButton variant="secondary" color="primary" data-test-id="edit-button">
                    <EditIcon />
                  </IconButton>
                  <TableButtonWrapper>
                    <IconButton
                      data-test-id="delete-button"
                      variant="secondary"
                      color="primary"
                      onClick={stopPropagation(() => onRemove(warehouse?.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableButtonWrapper>
                </div>
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
