import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import {
  maybe,
  renderCollection,
  transformOrderStatus,
  transformPaymentStatus
} from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { OrderDraftList_draftOrders_edges_node } from "../../types/OrderDraftList";

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up("lg")]: {
    colCustomer: {
      width: 300
    },
    colDate: {
      width: 300
    },
    colNumber: {
      width: 120
    },
    colTotal: {}
  },
  colCustomer: {},
  colDate: {},
  colNumber: {
    paddingLeft: 0
  },
  colTotal: {
    textAlign: "right"
  },
  link: {
    cursor: "pointer"
  }
}));

interface OrderDraftListProps extends ListProps, ListActions {
  orders: OrderDraftList_draftOrders_edges_node[];
}

const numberOfColumns = 5;

export const OrderDraftList: React.FC<OrderDraftListProps> = props => {
  const {
    disabled,
    settings,
    orders,
    pageInfo,
    onPreviousPage,
    onNextPage,
    onUpdateListSettings,
    onRowClick,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const orderDraftList = orders
    ? orders.map(order => ({
        ...order,
        paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
        status: transformOrderStatus(order.status, intl)
      }))
    : undefined;

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={orders}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCell className={classes.colNumber}>
          <FormattedMessage defaultMessage="No. of Order" />
        </TableCell>
        <TableCell className={classes.colDate}>
          <FormattedMessage
            defaultMessage="Date"
            description="order draft creation date"
          />
        </TableCell>
        <TableCell className={classes.colCustomer}>
          <FormattedMessage defaultMessage="Customer" />
        </TableCell>
        <TableCell className={classes.colTotal}>
          <FormattedMessage
            defaultMessage="Total"
            description="order draft total price"
          />
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
          orderDraftList,
          order => {
            const isSelected = order ? isChecked(order.id) : false;

            return (
              <TableRow
                hover={!!order}
                className={!!order ? classes.link : undefined}
                onClick={order ? onRowClick(order.id) : undefined}
                key={order ? order.id : "skeleton"}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(order.id)}
                  />
                </TableCell>
                <TableCell className={classes.colNumber}>
                  {maybe(() => order.number) ? (
                    "#" + order.number
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colDate}>
                  {maybe(() => order.created) ? (
                    <DateTime date={order.created} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colCustomer}>
                  {maybe(() => order.billingAddress) ? (
                    <>
                      {order.billingAddress.firstName}
                      &nbsp;
                      {order.billingAddress.lastName}
                    </>
                  ) : maybe(() => order.userEmail) !== undefined ? (
                    order.userEmail
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colTotal}>
                  {maybe(() => order.total.gross) ? (
                    <Money money={order.total.gross} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No draft orders found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderDraftList.displayName = "OrderDraftList";
export default OrderDraftList;
