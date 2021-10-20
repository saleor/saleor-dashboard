import { Button, CardContent, IconButton } from "@material-ui/core";
import ToggleIcon from "@material-ui/icons/ArrowDropDown";
import Money from "@saleor/components/Money";
import StatusLabel from "@saleor/components/StatusLabel";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { transformChargeStatus } from "../../../misc";
import { OrderAction } from "../../../types/globalTypes";
import { OrderDetails_order_payments } from "../../types/OrderDetails";
import { orderPaymentDetailsMessages as messages } from "./messages";
import { useStyles } from "./styles";

interface OrderPaymentDetailsProps {
  payment: OrderDetails_order_payments;
  onPaymentCapture: (id: string) => void;
  onPaymentVoid: (id: string) => void;
}

const OrderPaymentDetails: React.FC<OrderPaymentDetailsProps> = props => {
  const { payment, onPaymentCapture, onPaymentVoid } = props;
  const classes = useStyles(props);
  const [expanded, setExpanded] = React.useState(false);

  const canCapture = !!payment?.actions?.includes(OrderAction.CAPTURE);
  const canVoid = !!payment?.actions?.includes(OrderAction.VOID);

  const intl = useIntl();

  const paymentStatus = transformChargeStatus(
    payment?.chargeStatus || "",
    intl
  );

  return (
    <>
      <CardContent className={classes.cardContent}>
        <table className={classes.root}>
          <tbody>
            <tr>
              <td>
                <b>
                  {intl.formatMessage(messages.gatewayPayment, {
                    gatewayName: payment.gatewayName
                  })}
                </b>
                <IconButton
                  data-test="expand"
                  onClick={() => setExpanded(!expanded)}
                >
                  <ToggleIcon />
                </IconButton>
              </td>
              <td>
                <div className={classes.status}>
                  <StatusLabel
                    label={paymentStatus.localized}
                    status={paymentStatus.status}
                  />
                </div>
              </td>
            </tr>
            {expanded && (
              <>
                {payment.pspReference && (
                  <tr>
                    <td colSpan={2} className={classes.reference}>
                      {intl.formatMessage(messages.pspReference)}{" "}
                      {payment.pspReference}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>{intl.formatMessage(messages.preauthorizedAmount)}</td>
                  <td className={classes.textRight}>
                    <Money money={payment.total} />
                  </td>
                </tr>
                <tr>
                  <td>{intl.formatMessage(messages.capturedAmount)}</td>
                  <td className={classes.textRight}>
                    <Money money={payment.capturedAmount} />
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className={classNames(classes.textRight, classes.actions)}
                  >
                    {canVoid && (
                      <Button
                        color="primary"
                        variant="text"
                        onClick={() => onPaymentVoid(payment.id)}
                        className={classes.actions}
                      >
                        {intl.formatMessage(messages.voidPayment)}
                      </Button>
                    )}
                    {canCapture && (
                      <Button
                        color="primary"
                        variant="text"
                        onClick={() => onPaymentCapture(payment.id)}
                        className={classes.actions}
                      >
                        {intl.formatMessage(messages.capturePayment)}
                      </Button>
                    )}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </CardContent>
    </>
  );
};
OrderPaymentDetails.displayName = "OrderPaymentDetails";
export default OrderPaymentDetails;
