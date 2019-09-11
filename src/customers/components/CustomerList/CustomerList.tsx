import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { getUserName, maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colEmail: {},
      colName: {},
      colOrders: {
        width: 200
      }
    },
    colEmail: {},
    colName: {
      paddingLeft: 0
    },
    colOrders: {
      textAlign: "center"
    },
    tableRow: {
      cursor: "pointer"
    }
  });

export interface CustomerListProps
  extends ListProps,
    ListActions,
    WithStyles<typeof styles> {
  customers: ListCustomers_customers_edges_node[];
}

const numberOfColumns = 4;

const CustomerList = withStyles(styles, { name: "CustomerList" })(
  ({
    classes,
    settings,
    disabled,
    customers,
    pageInfo,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    toolbar,
    toggle,
    toggleAll,
    selected,
    isChecked
  }: CustomerListProps) => (
    <Table>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={customers}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCell className={classes.colName}>
          <FormattedMessage defaultMessage="Customer Name" />
        </TableCell>
        <TableCell className={classes.colEmail}>
          <FormattedMessage defaultMessage="Customer Email" />
        </TableCell>
        <TableCell className={classes.colOrders}>
          <FormattedMessage defaultMessage="No. of Orders" />
        </TableCell>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={numberOfColumns}
            settings={settings}
            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
            onNextPage={onNextPage}
            onUpdateListSettings={onUpdateListSettings}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : false
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          customers,
          customer => {
            const isSelected = customer ? isChecked(customer.id) : false;

            return (
              <TableRow
                className={!!customer ? classes.tableRow : undefined}
                hover={!!customer}
                key={customer ? customer.id : "skeleton"}
                selected={isSelected}
                onClick={customer ? onRowClick(customer.id) : undefined}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(customer.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {getUserName(customer)}
                </TableCell>
                <TableCell className={classes.colEmail}>
                  {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colOrders}>
                  {maybe<React.ReactNode>(
                    () => customer.orders.totalCount,
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No customers found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  )
);
CustomerList.displayName = "CustomerList";
export default CustomerList;
