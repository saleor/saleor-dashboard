import {
  Popover,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderList_orders_edges_node_payments } from "@saleor/orders/types/OrderList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { transformChargeStatus } from "../../../misc";

export interface OrderPaymentStatusProps {
  payments: OrderList_orders_edges_node_payments[];
  label: string | React.ReactNode;
  status: "success" | "alert" | "neutral" | "error" | undefined;
}

const useStyles = makeStyles(
  theme => ({
    popover: {
      pointerEvents: "none"
    },
    paper: {
      padding: theme.spacing(2)
    },
    paymentStatusList: {
      maxWidth: 400
    },
    tableCellHeader: {
      height: 0,
      borderBottom: "none"
    },
    tableCell: {
      height: 0,
      borderBottom: "none"
    }
  }),
  { name: "OrderPaymentStatus" }
);

const OrderPaymentStatus: React.FC<OrderPaymentStatusProps> = ({
  status,
  label,
  payments
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const paymentsList = payments
    ? payments.map(payment => ({
        ...payment,
        status: transformChargeStatus(payment.chargeStatus, intl)
      }))
    : [];

  return (
    <Typography
      aria-owns={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <StatusLabel status={status} label={label} />
      {paymentsList.length && (
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <div className={classes.paymentStatusList}>
            <ResponsiveTable>
              <TableHead>
                <TableRow>
                  <TableCellHeader className={classes.tableCellHeader}>
                    <FormattedMessage defaultMessage="Payment method" />
                  </TableCellHeader>
                  <TableCellHeader className={classes.tableCellHeader}>
                    <FormattedMessage defaultMessage="Status" />
                  </TableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsList.map((payment, key) => (
                  <TableRow key={key}>
                    <TableCell className={classes.tableCell}>
                      {payment.paymentMethodType}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <StatusLabel
                        status={payment.status.status}
                        label={payment.status.localized}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ResponsiveTable>
          </div>
        </Popover>
      )}
    </Typography>
  );
};

export default OrderPaymentStatus;
