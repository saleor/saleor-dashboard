// @ts-strict-ignore
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { DashboardCard } from "@dashboard/components/Card";
import Hr from "@dashboard/components/Hr";
import {
  SimpleRadioGroupField,
  SimpleRadioGroupFieldChoice,
} from "@dashboard/components/SimpleRadioGroupField";
import { OrderDetailsFragment, OrderErrorFragment, OrderRefundDataQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import { Checkbox, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { defineMessages, FormattedMessage, IntlShape, useIntl } from "react-intl";

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
  returnButton: {
    id: "bgO+7G",
    defaultMessage: "Return & Replace products",
    description: "order return amount button",
  },
});

interface PaymentSubmitCardProps {
  data: OrderRefundFormData | OrderReturnFormData;
  order: OrderRefundDataQuery["order"] | OrderDetailsFragment;
  disabled: boolean;
  loading: boolean;
  disableSubmitButton?: boolean;
  isReturn?: boolean;
  errors: OrderErrorFragment[];
  amountData: PaymentSubmitCardValuesProps;
  allowNoRefund?: boolean;
  onChange: (event: ChangeEvent) => void;
  onRefund: () => void;
}

const getAmountCalculationModeOptions = ({
  type,
  intl,
  allowNoRefund,
  disabled,
}: {
  type: OrderRefundType;
  intl: IntlShape;
  allowNoRefund: boolean;
  disabled: boolean;
}): SimpleRadioGroupFieldChoice[] => {
  const manualOption = {
    label: intl.formatMessage({
      id: "FOehC/",
      defaultMessage: "Manual Amount",
      description: "label",
    }),
    value: OrderRefundAmountCalculationMode.MANUAL,
    disabled: disabled,
  };

  const noRefundOption = {
    label: intl.formatMessage({
      id: "zzfj8H",
      defaultMessage: "No refund",
      description: "label",
    }),
    value: OrderRefundAmountCalculationMode.NONE,
    disabled: !allowNoRefund || disabled,
  };

  if (type === OrderRefundType.MISCELLANEOUS) {
    return [noRefundOption, manualOption];
  }

  return [
    noRefundOption,
    {
      label: intl.formatMessage({
        id: "JEIN47",
        defaultMessage: "Automatic Amount",
        description: "label",
      }),
      value: OrderRefundAmountCalculationMode.AUTOMATIC,
      disabled: disabled,
    },
    manualOption,
  ];
};

export const PaymentSubmitCard: React.FC<PaymentSubmitCardProps> = props => {
  const {
    data,
    order,
    disabled,
    loading,
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

  const showRefundShipmentCheckbox =
    data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC &&
    type === OrderRefundType.PRODUCTS;

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
        <SimpleRadioGroupField
          choices={getAmountCalculationModeOptions({
            type,
            intl,
            allowNoRefund,
            disabled,
          })}
          disabled={disabled}
          name={"amountCalculationMode" as keyof FormData}
          value={data.amountCalculationMode}
          onChange={change => {
            onChange(change);
          }}
        />

        {showRefundShipmentCheckbox && (
          <>
            <Checkbox
              disabled={disabled}
              checked={data.refundShipmentCosts}
              name="refundShipmentCosts"
              onCheckedChange={(checked: boolean) =>
                onChange({ target: { name: "refundShipmentCosts", value: checked } })
              }
              marginTop={4}
              marginBottom={2}
            >
              <Text>
                <FormattedMessage
                  id="EP+jcU"
                  defaultMessage="Refund shipment costs"
                  description="checkbox"
                />
              </Text>
            </Checkbox>
            <Hr className={classes.hr} />
          </>
        )}

        {type === OrderRefundType.PRODUCTS && (
          <>
            {data.amountCalculationMode === OrderRefundAmountCalculationMode.NONE && (
              <PaymentSubmitCardValues
                authorizedAmount={authorizedAmount}
                previouslyRefunded={previouslyRefunded}
                maxRefund={maxRefund}
                shipmentCost={data.refundShipmentCosts && shipmentCost}
              />
            )}

            {data.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC && (
              <PaymentSubmitCardValues
                authorizedAmount={authorizedAmount}
                previouslyRefunded={previouslyRefunded}
                maxRefund={maxRefund}
                selectedProductsValue={selectedProductsValue}
                refundTotalAmount={parsedRefundTotalAmount}
                shipmentCost={data.refundShipmentCosts && shipmentCost}
                replacedProductsValue={replacedProductsValue}
              />
            )}

            {data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL && (
              <>
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
          </>
        )}
        {type === OrderRefundType.MISCELLANEOUS && (
          <>
            <PaymentSubmitCardValues
              authorizedAmount={authorizedAmount}
              previouslyRefunded={previouslyRefunded}
              maxRefund={maxRefund}
            />
            {data.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL && (
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
            )}
          </>
        )}
        <ButtonWithLoader
          variant="primary"
          width="100%"
          onClick={onRefund}
          className={classes.refundButton}
          disabled={disableRefundButton || disabled}
          data-test-id="submit"
          transitionState={loading ? "loading" : "default"}
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
        </ButtonWithLoader>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
PaymentSubmitCard.displayName = "PaymentSubmitCard";
