import { AutomaticallyCompleteCheckouts } from "@dashboard/channels/components/ChannelForm/automatic-checkout-complete/AutomaticallyCompleteCheckouts";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import {
  type ChannelErrorFragment,
  isStagingSchema,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { orderSettingsPath } from "@dashboard/orders/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { AllowLegacyGiftCardUse } from "./AllowLegacyGiftCardUse";
import { AllowUnpaidOrders } from "./AllowUnpaidOrders";
import { type FormData } from "./ChannelForm";
import { DefaultTransactionFlowStrategy } from "./DefaultTransactionFlowStrategy";
import { MarkAsPaid } from "./MarkAsPaid";
import { messages } from "./messages";

interface ChannelOrderSettingsProps {
  data: FormData;
  disabled: boolean;
  errors: ChannelErrorFragment[];
  showHubHint?: boolean;
  savedAutomaticallyCompleteCheckouts: boolean;
  savedAutomaticCompletionCutOffDate: string;
  savedAutomaticCompletionCutOffTime: string;
  onChange: FormChange;
  onMarkAsPaidStrategyChange: () => void;
  onTransactionFlowStrategyChange: () => void;
  onAutomaticallyCompleteCheckoutsChange: () => void;
  onAllowLegacyGiftCardUseChange?: () => void;
}

export const ChannelOrderSettings = ({
  data,
  disabled,
  errors,
  showHubHint = true,
  savedAutomaticallyCompleteCheckouts,
  savedAutomaticCompletionCutOffDate,
  savedAutomaticCompletionCutOffTime,
  onChange,
  onMarkAsPaidStrategyChange,
  onTransactionFlowStrategyChange,
  onAutomaticallyCompleteCheckoutsChange,
  onAllowLegacyGiftCardUseChange,
}: ChannelOrderSettingsProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    [
      "deleteExpiredOrdersAfter",
      "automaticCompletionDelay",
      "automaticCompletionCutOffDate",
      "markAsPaidStrategy",
      "allowUnpaidOrders",
      "defaultTransactionFlowStrategy",
      "allowLegacyGiftCardUse",
    ],
    errors,
  );

  return (
    <Box display="flex" flexDirection="column" gap={4} data-test-id="channel-order-settings-fields">
      {showHubHint && (
        <Text size={3} color="default2">
          <FormattedMessage
            {...messages.orderAndCheckoutSettingsHint}
            values={{
              link: (
                <MicrocopyLink to={orderSettingsPath}>
                  <FormattedMessage {...sectionNames.ordersAndFulfillment} />
                </MicrocopyLink>
              ),
            }}
          />
        </Text>
      )}
      <Box paddingX={0}>
        <Checkbox
          name="automaticallyConfirmAllNewOrders"
          data-test-id="channel-automatically-confirm-orders-checkbox"
          checked={data.automaticallyConfirmAllNewOrders}
          onCheckedChange={value =>
            onChange({
              target: { name: "automaticallyConfirmAllNewOrders", value },
            })
          }
          disabled={disabled}
        >
          <Text>
            <FormattedMessage {...messages.automaticallyConfirmAllNewOrdersLabel} />
          </Text>
        </Checkbox>
        <Box paddingLeft={4}>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.automaticallyConfirmAllNewOrdersDescription} />
          </Text>
        </Box>
      </Box>
      <Box>
        <Checkbox
          name="automaticallyFulfillNonShippableGiftCard"
          data-test-id="channel-automatically-fulfill-gift-cards-checkbox"
          checked={data.automaticallyFulfillNonShippableGiftCard}
          onCheckedChange={value =>
            onChange({
              target: { name: "automaticallyFulfillNonShippableGiftCard", value },
            })
          }
          disabled={disabled}
        >
          <Text>
            <FormattedMessage {...messages.automaticallyFulfillNonShippableGiftCardLabel} />
          </Text>
        </Checkbox>
        <Box paddingLeft={4}>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.automaticallyFulfillNonShippableGiftCardDescription} />
          </Text>
        </Box>
      </Box>
      <Box>
        <Text size={2} color="default2" marginBottom={2}>
          <FormattedMessage {...messages.orderExpirationDescription} />
        </Text>
        <Input
          name="deleteExpiredOrdersAfter"
          data-test-id="delete-expired-order-input"
          value={data.deleteExpiredOrdersAfter}
          error={!!formErrors.deleteExpiredOrdersAfter}
          type="number"
          label={intl.formatMessage(messages.orderExpiration)}
          onChange={onChange}
          min={0}
          max={120}
        />
      </Box>
      <MarkAsPaid
        isChecked={data.markAsPaidStrategy === MarkAsPaidStrategyEnum.TRANSACTION_FLOW}
        onCheckedChange={onMarkAsPaidStrategyChange}
        hasError={!!formErrors.markAsPaidStrategy}
        disabled={disabled}
      />
      <AllowUnpaidOrders
        onChange={onChange}
        isChecked={data.allowUnpaidOrders}
        hasError={!!formErrors.allowUnpaidOrders}
        disabled={disabled}
      />
      <DefaultTransactionFlowStrategy
        onChange={onTransactionFlowStrategyChange}
        isChecked={
          data.defaultTransactionFlowStrategy === TransactionFlowStrategyEnum.AUTHORIZATION
        }
        hasError={!!formErrors.defaultTransactionFlowStrategy}
        disabled={disabled}
      />
      <AutomaticallyCompleteCheckouts
        hasError={!!formErrors.automaticCompletionDelay}
        isChecked={data.automaticallyCompleteCheckouts}
        disabled={disabled}
        delay={data.automaticCompletionDelay}
        cutOffDate={data.automaticCompletionCutOffDate}
        cutOffTime={data.automaticCompletionCutOffTime}
        cutOffDateError={!!formErrors.automaticCompletionCutOffDate}
        savedIsEnabled={savedAutomaticallyCompleteCheckouts}
        savedCutOffDate={savedAutomaticCompletionCutOffDate}
        savedCutOffTime={savedAutomaticCompletionCutOffTime}
        onCheckboxChange={onAutomaticallyCompleteCheckoutsChange}
        onDelayChange={onChange}
        onCutOffDateChange={onChange}
        onCutOffTimeChange={onChange}
      />
      {isStagingSchema() && (
        <AllowLegacyGiftCardUse
          onChange={onAllowLegacyGiftCardUseChange ? onAllowLegacyGiftCardUseChange : () => {}}
          hasError={!!formErrors.allowLegacyGiftCardUse}
          isChecked={data.allowLegacyGiftCardUse!}
          disabled={disabled}
        />
      )}
    </Box>
  );
};
