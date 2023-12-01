import { DashboardCard } from "@dashboard/components/Card";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import PriceField from "@dashboard/components/PriceField";
import { FormChange } from "@dashboard/hooks/useForm";
import { OrderRefundAmountValuesProps } from "@dashboard/orders/components/OrderRefundReturnAmount/OrderRefundReturnAmountValues";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Checkbox, InfoIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderReturnData } from "../../form";
import { submitCardMessages } from "./messages";
import { useSubmitCardStyles } from "./styles";

interface SubmitCardProps {
  disabled: boolean;
  onSubmit: () => void;
  submitStatus: ConfirmButtonTransitionState;
  autoGrantRefund: boolean;
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  shippingCosts: IMoney;
  amountData: OrderRefundAmountValuesProps;
  customRefundValue: number;
  onChange: FormChange;
}

export const SubmitCard = ({
  disabled,
  onSubmit,
  submitStatus,
  autoGrantRefund,
  refundShipmentCosts,
  canRefundShipping,
  amountData,
  onChange,
  customRefundValue,
}: SubmitCardProps) => {
  const intl = useIntl();
  const classes = useSubmitCardStyles();

  return (
    <div>
      <DashboardCard>
        <DashboardCard.Title>
          {intl.formatMessage(submitCardMessages.cardTitle)}
        </DashboardCard.Title>
        <DashboardCard.Content display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={1} alignItems="center">
            <InfoIcon color="iconNeutralSubdued" size="small" />
            <Text color="textNeutralSubdued">
              <FormattedMessage {...submitCardMessages.descrption} />
            </Text>
          </Box>
          <Checkbox
            checked={autoGrantRefund}
            name={"autoGrantRefund" satisfies keyof OrderReturnData}
            onCheckedChange={checked => {
              onChange({
                target: {
                  name: "autoGrantRefund",
                  value: checked,
                },
              });
            }}
          >
            <Text>
              <FormattedMessage {...submitCardMessages.autoGrantRefund} />
            </Text>
          </Checkbox>
          <Checkbox
            checked={refundShipmentCosts}
            name={"refundShipmentCosts" satisfies keyof OrderReturnData}
            onCheckedChange={checked => {
              onChange({
                target: {
                  name: "refundShipmentCosts",
                  value: checked,
                },
              });
            }}
            disabled={!canRefundShipping || !autoGrantRefund}
          >
            <Text
              color={
                !canRefundShipping || !autoGrantRefund
                  ? "textNeutralDisabled"
                  : undefined
              }
            >
              <FormattedMessage
                {...submitCardMessages.refundShipment}
                values={{
                  currency: amountData?.shipmentCost?.currency,
                  amount: amountData?.shipmentCost?.amount,
                }}
              />
            </Text>
          </Checkbox>
          <PriceField
            onChange={onChange}
            name="amount"
            value={
              autoGrantRefund
                ? customRefundValue?.toString() ??
                  amountData?.refundTotalAmount?.amount?.toString()
                : ""
            }
            currencySymbol={amountData?.refundTotalAmount?.currency}
            disabled={!autoGrantRefund}
          />
          <div className={classes.submitButtonWrapper}>
            <ConfirmButton
              data-test-id="return-submit-button"
              transitionState={submitStatus}
              disabled={disabled}
              variant="primary"
              onClick={onSubmit}
            >
              <FormattedMessage {...submitCardMessages.submitButton} />
            </ConfirmButton>
          </div>
        </DashboardCard.Content>
      </DashboardCard>
    </div>
  );
};
