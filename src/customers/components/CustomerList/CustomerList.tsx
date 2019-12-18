import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { getUserName, maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps, SortPage } from "@saleor/types";
import { CustomerListUrlSortField } from "@saleor/customers/urls";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { getArrowDirection } from "@saleor/utils/sort";
import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";

const useStyles = makeStyles(
  theme => ({
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
  }),
  { name: "CustomerList" }
);

export interface CustomerListProps
  extends ListProps,
    ListActions,
    SortPage<CustomerListUrlSortField> {
  customers: ListCustomers_customers_edges_node[];
}

const numberOfColumns = 4;

const CustomerList: React.FC<CustomerListProps> = props => {
  const {
    settings,
    disabled,
    customers,
    pageInfo,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    toolbar,
    toggle,
    toggleAll,
    selected,
    sort,
    isChecked
  } = props;

  const classes = useStyles(props);

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={customers}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === CustomerListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(CustomerListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage defaultMessage="Customer Name" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === CustomerListUrlSortField.email
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(CustomerListUrlSortField.email)}
          className={classes.colEmail}
        >
          <FormattedMessage defaultMessage="Customer Email" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === CustomerListUrlSortField.orders
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="center"
          onClick={() => onSort(CustomerListUrlSortField.orders)}
          className={classes.colOrders}
        >
          <FormattedMessage defaultMessage="No. of Orders" />
        </TableCellHeader>
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
    </ResponsiveTable>
  );
};
CustomerList.displayName = "CustomerList";
export default CustomerList;
