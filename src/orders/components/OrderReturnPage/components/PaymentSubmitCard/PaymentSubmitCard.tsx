// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Hr from "@dashboard/components/Hr";
import { OrderDetailsFragment, OrderErrorFragment, OrderRefundDataQuery } from "@dashboard/graphql";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType,
} from "../../../OrderRefundPage/form";
import { OrderReturnFormData } from "../../form";
import { PaymentSubmitCardValues, PaymentSubmitCardValuesProps } from "./PaymentSubmitCardValues";
import RefundAmountInput from "./RefundAmountInput";

const useStyles = makeStyles(
  theme => ({
    content: {
      paddingTop: theme.spacing(1.5),
    },
    hr: {
      margin: theme.spacing(1, 0),
    },
    maxRefundRow: {
      fontWeight: 600,
    },
    priceField: {
      marginTop: theme.spacing(2),
    },
    refundButton: {
      marginTop: theme.spacing(2),
    },
    refundCaution: {
      marginTop: theme.spacing(1),
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%",
    },
    textRight: {
      textAlign: "right",
    },
  }),
  { name: "PaymentSubmitCard" },
);
const messages = defineMessages({
  refundButton: {
    id: "QkFeOa",
    defaultMessage: "Refund",
    description: "order refund amount button",
  },
  refundCannotBeFulfilled: {
    id: "AKv2BI",
    defaultMessage: "Refunded items can't be fulfilled",
    description: "order refund subtitle",
  },
  returnButton: {
    id: "bgO+7G",
    defaultMessage: "Return & Replace products",
    description: "order return amount button",
  },
  returnCannotBeFulfilled: {
    id: "Uo5/Ov",
    defaultMessage: "Returned items can't be fulfilled",
    description: "order return subtitle",
  },
});

interface PaymentSubmitCardProps {
  data: OrderRefundFormData | OrderReturnFormData;
  order: OrderRefundDataQuery["order"] | OrderDetailsFragment;
  disabled: boolean;
  disableSubmitButton?: boolean;
  isReturn?: boolean;
  errors: OrderErrorFragment[];
  amountData: PaymentSubmitCardValuesProps;
  allowNoRefund?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onRefund: () => void;
}

export const PaymentSubmitCard: React.FC<PaymentSubmitCardProps> = props => {
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
    allowNoRefund = false,
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
    replacedProductsValue,
  } = amountData;
  const isRefundAutomatic =
    type === OrderRefundType.PRODUCTS &&
    data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC;
  const selectedRefundAmount = isRefundAutomatic ? refundTotalAmount?.amount : Number(data.amount);
  const isAmountTooSmall = selectedRefundAmount && selectedRefundAmount <= 0;
  const isAmountTooBig = selectedRefundAmount > maxRefund?.amount;
  const parsedRefundTotalAmount = isAmountTooBig ? maxRefund : refundTotalAmount;
  const shouldRefundButtonBeDisabled = () => {
    if (isAmountTooSmall) {
      return true;
    }

    if (
      data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL ||
      type === OrderRefundType.MISCELLANEOUS
    ) {
      if (isAmountTooBig) {
        return true;
      }
    }

    if (isReturn) {
      return disableSubmitButton;
    }

    return !selectedRefundAmount;
  };
  const disableRefundButton = shouldRefundButtonBeDisabled();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "0oo+BT",
            defaultMessage: "Refunded Amount",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.content}>
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
                  id: "zzfj8H",
                  defaultMessage: "No refund",
                  description: "label",
                })}
              />
            )}
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.AUTOMATIC}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                id: "JEIN47",
                defaultMessage: "Automatic Amount",
                description: "label",
              })}
            />
            {data.amountCalculationMode === OrderRefundAmountCalculationMode.NONE && (
              <>
                <CardSpacer />
                <PaymentSubmitCardValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                />
              </>
            )}
            {data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC && (
              <>
                <ControlledCheckbox
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    id: "EP+jcU",
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox",
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <CardSpacer />
                <PaymentSubmitCardValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  refundTotalAmount={parsedRefundTotalAmount}
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
                id: "FOehC/",
                defaultMessage: "Manual Amount",
                description: "label",
              })}
            />
            {data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL && (
              <>
                <ControlledCheckbox
                  disabled={disabled}
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    id: "EP+jcU",
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox",
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <PaymentSubmitCardValues
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
            <PaymentSubmitCardValues
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
          variant="primary"
          fullWidth
          onClick={onRefund}
          className={classes.refundButton}
          disabled={disableRefundButton}
          data-test-id="submit"
        >
          {!disableRefundButton && !isReturn ? (
            <FormattedMessage
              id="8F2D1H"
              defaultMessage="Refund {currency} {amount}"
              description="order refund amount, input button"
              values={{
                amount: isRefundAutomatic
                  ? parsedRefundTotalAmount.amount.toFixed(2)
                  : Number(selectedRefundAmount).toFixed(2),
                currency: amountCurrency,
              }}
            />
          ) : (
            intl.formatMessage(isReturn ? messages.returnButton : messages.refundButton)
          )}
        </Button>
        <Typography variant="caption" color="textSecondary" className={classes.refundCaution}>
          {intl.formatMessage(
            isReturn ? messages.returnCannotBeFulfilled : messages.refundCannotBeFulfilled,
          )}
        </Typography>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
PaymentSubmitCard.displayName = "PaymentSubmitCard";
