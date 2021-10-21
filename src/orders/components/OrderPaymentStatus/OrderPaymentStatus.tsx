import {
  Popover,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { StatusType } from "@saleor/components/StatusChip/types";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { OrderList_orders_edges_node_payments } from "@saleor/orders/types/OrderList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { transformChargeStatus } from "../../../misc";
import { orderPaymentStatusMessages as messages } from "./messages";
import { useStyles } from "./styles";

export interface OrderPaymentStatusProps {
  payments: OrderList_orders_edges_node_payments[];
  label: string | React.ReactNode;
  status: StatusType;
}

const OrderPaymentStatus: React.FC<OrderPaymentStatusProps> = ({
  status,
  label,
  payments
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = !!anchorEl;

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const paymentsList =
    payments?.map(payment => ({
      ...payment,
      status: transformChargeStatus(payment.chargeStatus, intl)
    })) || [];

  return (
    <Typography
      aria-owns={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <StatusLabel status={status} label={label} />
      {paymentsList.length > 0 && (
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
                    <FormattedMessage {...messages.paymentMethod} />
                  </TableCellHeader>
                  <TableCellHeader
                    textAlign="right"
                    className={classes.tableCellHeader}
                  >
                    <FormattedMessage {...messages.paymentStatus} />
                  </TableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsList.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      {payment.gatewayName}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.statusCell}>
                        <StatusLabel
                          status={payment.status.status}
                          label={payment.status.localized}
                        />
                      </div>
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
