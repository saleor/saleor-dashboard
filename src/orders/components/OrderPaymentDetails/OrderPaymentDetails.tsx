import { Button, CardContent, IconButton } from "@material-ui/core";
import ToggleIcon from "@material-ui/icons/ArrowDropDown";
import Money from "@saleor/components/Money";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, transformChargeStatus } from "../../../misc";
import { OrderAction } from "../../../types/globalTypes";
import { OrderDetails_order_payments } from "../../types/OrderDetails";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    cardContent: {
      paddingTop: 0,
      paddingBottom: 0
    },
    textRight: {
      textAlign: "right"
    },
    status: {
      display: "flex",
      flexDirection: "row-reverse"
    },
    actions: {
      "&:last-child": {
        marginRight: theme.spacing(-1)
      }
    },
    reference: {
      color: theme.palette.text.disabled,
      fontSize: 14
    }
  }),
  { name: "OrderPaymentDetails" }
);

interface OrderPaymentDetailsProps {
  payment: OrderDetails_order_payments;
  onPaymentCapture: (id: string) => void;
  onPaymentVoid: (id: string) => void;
}

const OrderPaymentDetails: React.FC<OrderPaymentDetailsProps> = props => {
  const { payment, onPaymentCapture, onPaymentVoid } = props;
  const classes = useStyles(props);
  const [expanded, setExpanded] = React.useState(false);

  const canCapture = maybe(() => payment.actions, []).includes(
    OrderAction.CAPTURE
  );
  const canVoid = maybe(() => payment.actions, []).includes(OrderAction.VOID);

  const intl = useIntl();

  const paymentStatus = transformChargeStatus(
    maybe(() => payment.chargeStatus),
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
                  {intl.formatMessage(
                    {
                      defaultMessage: "{gatewayName} Payment",
                      description: "payment header with gateway name"
                    },
                    {
                      gatewayName: payment.gatewayName
                    }
                  )}
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
                      <FormattedMessage
                        defaultMessage="PSP reference:"
                        description="order payment"
                      />{" "}
                      {payment.pspReference}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <FormattedMessage
                      defaultMessage="Preauthorized amount"
                      description="order payment"
                    />
                  </td>
                  <td className={classes.textRight}>
                    <Money money={payment.total} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage
                      defaultMessage="Captured amount"
                      description="order payment"
                    />
                  </td>
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
                        <FormattedMessage
                          defaultMessage="Void"
                          description="void payment, button"
                        />
                      </Button>
                    )}
                    {canCapture && (
                      <Button
                        color="primary"
                        variant="text"
                        onClick={() => onPaymentCapture(payment.id)}
                        className={classes.actions}
                      >
                        <FormattedMessage
                          defaultMessage="Capture"
                          description="capture payment, button"
                        />
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
