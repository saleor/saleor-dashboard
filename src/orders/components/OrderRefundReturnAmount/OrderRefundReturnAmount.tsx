import { makeStyles, RadioGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType
} from "../OrderRefundPage/form";
import { OrderReturnFormData } from "../OrderReturnPage/form";
import OrderRefundAmountValues, {
  OrderRefundAmountValuesProps
} from "./OrderRefundReturnAmountValues";
import RefundAmountInput from "./RefundAmountInput";

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(1, 0)
    },
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

const messages = defineMessages({
  refundButton: {
    defaultMessage: "Refund",
    description: "order refund amount button"
  },
  refundCannotBeFulfilled: {
    defaultMessage: "Refunded items can't be fulfilled",
    description: "order refund subtitle"
  },
  returnButton: {
    defaultMessage: "Return & Replace products",
    description: "order return amount button"
  },
  returnCannotBeFulfilled: {
    defaultMessage: "Returned items can't be fulfilled",
    description: "order return subtitle"
  }
});

interface OrderRefundAmountProps {
  data: OrderRefundFormData | OrderReturnFormData;
  order: OrderRefundData_order | OrderDetails_order;
  disabled: boolean;
  disableSubmitButton?: boolean;
  isReturn?: boolean;
  errors: OrderErrorFragment[];
  amountData: OrderRefundAmountValuesProps;
  allowNoRefund?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onRefund: () => void;
}

const OrderRefundAmount: React.FC<OrderRefundAmountProps> = props => {
  const {
    data,
    order,
    disabled,
    errors,
    onChange,
    onRefund,
    isReturn = false,
    amountData,
    disableSubmitButton,
    allowNoRefund = false
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const { type = OrderRefundType.PRODUCTS } = data as OrderRefundFormData;

  const amountCurrency = order?.total?.gross?.currency;

  const {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost,
    replacedProductsValue
  } = amountData;

  const selectedRefundAmount =
    type === OrderRefundType.PRODUCTS &&
    data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC
      ? refundTotalAmount?.amount
      : data.amount;

  const isAmountTooSmall = selectedRefundAmount && selectedRefundAmount <= 0;
  const isAmountTooBig = selectedRefundAmount > maxRefund?.amount;

  const disableRefundButton = isReturn
    ? disableSubmitButton || isAmountTooSmall || isAmountTooBig
    : !selectedRefundAmount || isAmountTooBig || isAmountTooSmall;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refunded Amount",
          description: "section header"
        })}
      />
      <CardContent>
        {type === OrderRefundType.PRODUCTS && (
          <RadioGroup
            value={data.amountCalculationMode}
            onChange={onChange}
            name="amountCalculationMode"
          >
            {allowNoRefund && (
              <FormControlLabel
                disabled={disabled}
                value={OrderRefundAmountCalculationMode.NONE}
                control={<Radio color="primary" />}
                label={intl.formatMessage({
                  defaultMessage: "No refund",
                  description: "label"
                })}
              />
            )}
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.AUTOMATIC}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Automatic Amount",
                description: "label"
              })}
            />
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.NONE && (
              <>
                <CardSpacer />
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                />
              </>
            )}
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.AUTOMATIC && (
              <>
                <ControlledCheckbox
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <CardSpacer />
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  refundTotalAmount={refundTotalAmount}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                  replacedProductsValue={replacedProductsValue}
                />
              </>
            )}
            <Hr className={classes.hr} />
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.MANUAL}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Manual Amount",
                description: "label"
              })}
            />
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.MANUAL && (
              <>
                <ControlledCheckbox
                  disabled={disabled}
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  proposedRefundAmount={proposedRefundAmount}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                  replacedProductsValue={replacedProductsValue}
                />
                <RefundAmountInput
                  data={data as OrderRefundFormData}
                  maxRefund={maxRefund}
                  amountTooSmall={isAmountTooSmall}
                  amountTooBig={isAmountTooBig}
                  currencySymbol={amountCurrency}
                  disabled={disabled}
                  onChange={onChange}
                  errors={errors}
                />
              </>
            )}
          </RadioGroup>
        )}
        {type === OrderRefundType.MISCELLANEOUS && (
          <>
            <OrderRefundAmountValues
              authorizedAmount={authorizedAmount}
              previouslyRefunded={previouslyRefunded}
              maxRefund={maxRefund}
            />
            <RefundAmountInput
              data={data as OrderRefundFormData}
              maxRefund={maxRefund}
              amountTooSmall={isAmountTooSmall}
              amountTooBig={isAmountTooBig}
              currencySymbol={amountCurrency}
              disabled={disabled}
              onChange={onChange}
              errors={errors}
            />
          </>
        )}
        <Button
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={onRefund}
          className={classes.refundButton}
          disabled={disableRefundButton}
          data-test="submit"
        >
          {!disableRefundButton && !isReturn ? (
            <FormattedMessage
              defaultMessage="Refund {currency} {amount}"
              description="order refund amount, input button"
              values={{
                amount: Number(selectedRefundAmount).toFixed(2),
                currency: amountCurrency
              }}
            />
          ) : (
            intl.formatMessage(
              isReturn ? messages.returnButton : messages.refundButton
            )
          )}
        </Button>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.refundCaution}
        >
          {intl.formatMessage(
            isReturn
              ? messages.returnCannotBeFulfilled
              : messages.refundCannotBeFulfilled
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};
OrderRefundAmount.displayName = "OrderRefundAmount";
export default OrderRefundAmount;
