import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import PriceField from "@dashboard/components/PriceField";
import {
  OrderDetailsFragment,
  OrderGrantRefundCreateErrorFragment,
  TransactionRequestRefundForGrantedRefundErrorFragment,
} from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { PaymentSubmitCardValuesProps } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard/PaymentSubmitCardValues";
import { IMoney } from "@dashboard/utils/intl";
import { Box, InfoIcon, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { canSendRefundDuringReturn, getReturnRefundValue } from "../../utils";
import { GrantRefundCheckbox } from "./GrantRefundCheckbox";
import { submitCardMessages } from "./messages";
import RefundShipmentCheckbox from "./RefundShipmentCheckbox";
import { SendRefundCheckbox } from "./SendRefundCheckbox";

interface TransactionSubmitCardProps {
  disabled: boolean;
  onSubmit: () => void;
  submitStatus: ConfirmButtonTransitionState;
  autoGrantRefund: boolean;
  autoSendRefund: boolean;
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  shippingCosts: IMoney;
  amountData: PaymentSubmitCardValuesProps;
  customRefundValue: number | undefined;
  onChange: FormChange;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  transactions: OrderDetailsFragment["transactions"];
  isAmountDirty: boolean;
  onAmountChange: (value: number) => void;
}

export const TransactionSubmitCard = ({
  disabled,
  onSubmit,
  submitStatus,
  autoGrantRefund,
  autoSendRefund,
  refundShipmentCosts,
  canRefundShipping,
  amountData,
  onChange,
  customRefundValue,
  grantRefundErrors,
  sendRefundErrors,
  transactions,
  isAmountDirty,
  onAmountChange,
}: TransactionSubmitCardProps) => {
  const intl = useIntl();
  const canSendRefund = canSendRefundDuringReturn({
    autoGrantRefund,
    transactions,
  });

  return (
    <div>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            {intl.formatMessage(submitCardMessages.cardTitle)}
          </DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content display="flex" flexDirection="column" gap={2} alignItems="start">
          <Box display="flex" gap={1} alignItems="center" marginBottom={4}>
            <InfoIcon color="default2" size="small" />
            <Text color="default2">
              <FormattedMessage {...submitCardMessages.descrption} />
            </Text>
          </Box>
          <GrantRefundCheckbox
            autoGrantRefund={autoGrantRefund}
            grantRefundErrors={grantRefundErrors}
            onChange={onChange}
          />
          <SendRefundCheckbox
            canSendRefund={canSendRefund}
            autoSendRefund={autoSendRefund}
            sendRefundErrors={sendRefundErrors}
            onChange={onChange}
          />
          <RefundShipmentCheckbox
            refundShipmentCosts={refundShipmentCosts}
            canRefundShipping={canRefundShipping}
            autoGrantRefund={autoGrantRefund}
            shipmentCost={amountData?.shipmentCost}
            onChange={onChange}
          />
          <PriceField
            label={intl.formatMessage(submitCardMessages.returnRefundValueLabel)}
            onChange={e => onAmountChange(e.target.value)}
            name="amount"
            value={getReturnRefundValue({
              autoGrantRefund,
              isAmountDirty,
              customRefundValue,
              amountData,
            })}
            currencySymbol={amountData?.refundTotalAmount?.currency}
            disabled={!autoGrantRefund}
          />
          <Box display="flex" alignSelf="end" marginTop={4}>
            <ConfirmButton
              data-test-id="return-submit-button"
              transitionState={submitStatus}
              disabled={disabled}
              variant="primary"
              onClick={onSubmit}
            >
              <FormattedMessage {...submitCardMessages.submitButton} />
            </ConfirmButton>
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    </div>
  );
};
