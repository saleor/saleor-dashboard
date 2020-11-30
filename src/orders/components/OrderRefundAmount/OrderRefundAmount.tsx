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
import { IMoney } from "@saleor/components/Money";
import PriceField from "@saleor/components/PriceField";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import {
  getAllFulfillmentLinesPriceSum,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum
} from "@saleor/orders/utils/data";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderRefundAmountValues, {
  OrderRefundAmountValuesProps
} from "../OrderRefundAmountValues";
import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType
} from "../OrderRefundPage/form";

const getMiscellaneousAmountValues = (
  order: OrderRefundData_order
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded
  };
};

const getProductsAmountValues = (
  order: OrderRefundData_order,
  data: OrderRefundFormData
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const shipmentCost =
    authorizedAmount?.currency &&
    (order?.shippingPrice?.gross || {
      amount: 0,
      currency: authorizedAmount?.currency
    });
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;
  const refundedLinesSum = getRefundedLinesPriceSum(
    order?.lines,
    data.refundedProductQuantities
  );
  const allFulfillmentLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    data.refundedFulfilledProductQuantities
  );
  const allLinesSum = refundedLinesSum + allFulfillmentLinesSum;
  const calculatedTotalAmount = data.refundShipmentCosts
    ? allLinesSum + shipmentCost?.amount
    : allLinesSum;
  const selectedProductsValue = authorizedAmount?.currency && {
    amount: allLinesSum,
    currency: authorizedAmount.currency
  };
  const proposedRefundAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency
  };
  const refundTotalAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency
  };

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost
  };
};

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

interface RefundAmountInputProps {
  data: OrderRefundFormData;
  maxRefund: IMoney;
  currencySymbol: string;
  amountTooSmall: boolean;
  amountTooBig: boolean;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const RefundAmountInput: React.FC<RefundAmountInputProps> = props => {
  const {
    data,
    maxRefund,
    amountTooSmall,
    amountTooBig,
    currencySymbol,
    disabled,
    errors,
    onChange
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);

  const formErrors = getFormErrors(["amount"], errors);

  return (
    <PriceField
      disabled={disabled}
      onChange={onChange}
      currencySymbol={currencySymbol}
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
      error={!!formErrors.amount || amountTooSmall || amountTooBig}
      hint={
        getOrderErrorMessage(formErrors.amount, intl) ||
        (amountTooSmall &&
          intl.formatMessage({
            defaultMessage: "Amount must be bigger than 0"
          })) ||
        (amountTooBig &&
          intl.formatMessage({
            defaultMessage: "Amount cannot be bigger than max refund"
          }))
      }
    />
  );
};

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

  const amountCurrency = order?.total?.gross?.currency;

  const {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost
  } =
    data.type === OrderRefundType.PRODUCTS
      ? getProductsAmountValues(order, data)
      : getMiscellaneousAmountValues(order);

  const selectedRefundAmount =
    data.type === OrderRefundType.PRODUCTS &&
    data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC
      ? refundTotalAmount?.amount
      : data.amount;

  const isAmountTooSmall = selectedRefundAmount && selectedRefundAmount <= 0;
  const isAmountTooBig = selectedRefundAmount > maxRefund?.amount;

  const disableRefundButton =
    !selectedRefundAmount || isAmountTooSmall || isAmountTooBig;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refunded Amount",
          description: "section header"
        })}
      />
      <CardContent>
        {data.type === OrderRefundType.PRODUCTS && (
          <RadioGroup
            value={data.amountCalculationMode}
            onChange={onChange}
            name="amountCalculationMode"
          >
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
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  refundTotalAmount={refundTotalAmount}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                />
                <CardSpacer />
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
                />
                <RefundAmountInput
                  data={data}
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
        {data.type === OrderRefundType.MISCELLANEOUS && (
          <>
            <OrderRefundAmountValues
              authorizedAmount={authorizedAmount}
              previouslyRefunded={previouslyRefunded}
              maxRefund={maxRefund}
            />
            <RefundAmountInput
              data={data}
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
                amount: Number(selectedRefundAmount).toFixed(2),
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
