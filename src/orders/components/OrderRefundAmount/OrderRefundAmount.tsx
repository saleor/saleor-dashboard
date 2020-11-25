import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Money, { addMoney, subtractMoney } from "@saleor/components/Money";
import PriceField from "@saleor/components/PriceField";
import Skeleton from "@saleor/components/Skeleton";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  theme => ({
    maxRefundRow: {
      fontWeight: 600
    },
    priceField: {
      marginTop: theme.spacing(2)
    },
    refundButton: {
      marginTop: theme.spacing(2)
    },
    refundCaution: {
      marginTop: theme.spacing(1)
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "OrderRefundAmount" }
);

interface OrderRefundAmountProps {
  data: OrderRefundFormData;
  order: OrderRefundData_order;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onRefund: () => void;
}

const OrderRefundAmount: React.FC<OrderRefundAmountProps> = props => {
  const { data, order, disabled, errors, onChange, onRefund } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  // TODO: change below values to appropriate!...
  const authorizedAmount = order?.total.gross;
  const previouslyRefunded =
    order?.totalCaptured &&
    authorizedAmount &&
    subtractMoney(order?.totalCaptured, authorizedAmount);
  const maxRefund =
    authorizedAmount &&
    previouslyRefunded &&
    addMoney(authorizedAmount, previouslyRefunded);
  const amountCurrency = authorizedAmount?.currency;
  // ...end of values requiring change

  const formErrors = getFormErrors(["amount"], errors);

  const isAmountTooSmall = data.amount && data.amount <= 0;
  const isAmountTooBig = data.amount > maxRefund?.amount;

  const disableRefundButton =
    !data.amount || isAmountTooSmall || isAmountTooBig;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refunded Amount",
          description: "section header"
        })}
      />
      <CardContent>
        <table className={classes.root}>
          <tbody>
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Authorized Amount"
                  description="order refund amount"
                />
              </td>
              <td className={classes.textRight}>
                {authorizedAmount ? (
                  <Money money={authorizedAmount} />
                ) : (
                  <Skeleton />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <FormattedMessage
                  defaultMessage="Previously refunded"
                  description="order refund amount"
                />
              </td>
              <td className={classes.textRight}>
                {previouslyRefunded ? (
                  <>
                    <Money money={previouslyRefunded} />
                  </>
                ) : (
                  <Skeleton />
                )}
              </td>
            </tr>
            <tr className={classes.maxRefundRow}>
              <td>
                <FormattedMessage
                  defaultMessage="Max Refund"
                  description="order refund amount"
                />
              </td>
              <td className={classes.textRight}>
                {maxRefund ? <Money money={maxRefund} /> : <Skeleton />}
              </td>
            </tr>
          </tbody>
        </table>
        <PriceField
          disabled={disabled}
          onChange={onChange}
          currencySymbol={amountCurrency}
          name={"amount" as keyof FormData}
          value={data.amount}
          label={intl.formatMessage({
            defaultMessage: "Amount",
            description: "order refund amount, input label"
          })}
          className={classes.priceField}
          InputProps={{ inputProps: { max: maxRefund?.amount } }}
          inputProps={{
            "data-test": "amountInput",
            max: maxRefund?.amount
          }}
          error={!!formErrors.amount || isAmountTooSmall || isAmountTooBig}
          hint={
            getOrderErrorMessage(formErrors.amount, intl) ||
            (isAmountTooSmall &&
              intl.formatMessage({
                defaultMessage: "Amount must be bigger than 0"
              })) ||
            (isAmountTooBig &&
              intl.formatMessage({
                defaultMessage: "Amount cannot be bigger than max refund"
              }))
          }
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={onRefund}
          className={classes.refundButton}
          disabled={disabled || disableRefundButton}
          data-test="submit"
        >
          {!disableRefundButton ? (
            <FormattedMessage
              defaultMessage="Refund {currency} {amount}"
              description="order refund amount, input button"
              values={{
                amount: data.amount,
                currency: amountCurrency
              }}
            />
          ) : (
            <FormattedMessage
              defaultMessage="Refund"
              description="order refund amount, input button"
            />
          )}
        </Button>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.refundCaution}
        >
          <FormattedMessage
            defaultMessage="Refunded items can’t be fulfilled"
            description="order refund amount"
          />
        </Typography>
      </CardContent>
    </Card>
  );
};
OrderRefundAmount.displayName = "OrderRefundAmount";
export default OrderRefundAmount;
