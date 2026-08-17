import { AutomaticallyCompleteCheckoutsFields } from "@dashboard/channels/components/ChannelForm/automatic-checkout-complete/AutomaticallyCompleteCheckouts";
import { type ChannelErrorFragment, isStagingSchema } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { CircleAlertIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { AllowLegacyGiftCardUse } from "./AllowLegacyGiftCardUse";
import { type FormData } from "./ChannelForm";
import { ChannelSettingNestedField, ChannelSettingToggleRow } from "./ChannelSettingToggleRow";
import { DefaultTransactionFlowStrategy } from "./DefaultTransactionFlowStrategy";
import { MarkAsPaid } from "./MarkAsPaid";
import { messages } from "./messages";

/** Default hours when enabling release-funds-for-expired-checkouts. */
export const DEFAULT_CHECKOUT_TTL_BEFORE_RELEASING_FUNDS_HOURS = 6;

interface ChannelPaymentsCheckoutSectionProps {
  data: FormData;
  disabled: boolean;
  errors: ChannelErrorFragment[];
  savedAutomaticallyCompleteCheckouts: boolean;
  savedAutomaticCompletionCutOffDate: string;
  savedAutomaticCompletionCutOffTime: string;
  onChange: FormChange;
}

export const ChannelPaymentsCheckoutSection = ({
  data,
  disabled,
  errors,
  savedAutomaticallyCompleteCheckouts,
  savedAutomaticCompletionCutOffDate,
  savedAutomaticCompletionCutOffTime,
  onChange,
}: ChannelPaymentsCheckoutSectionProps) => {
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    [
      "automaticCompletionDelay",
      "automaticCompletionCutOffDate",
      "markAsPaidStrategy",
      "defaultTransactionFlowStrategy",
      "allowLegacyGiftCardUse",
      "checkoutTtlBeforeReleasingFunds",
    ],
    errors,
  );
  const releaseFundsEnabled = !!data.releaseFundsForExpiredCheckouts;

  const setReleaseFundsEnabled = (enabled: boolean) => {
    onChange({
      target: {
        name: "releaseFundsForExpiredCheckouts",
        value: enabled,
      },
    });

    if (
      enabled &&
      (data.checkoutTtlBeforeReleasingFunds === null ||
        data.checkoutTtlBeforeReleasingFunds === undefined ||
        data.checkoutTtlBeforeReleasingFunds === 0)
    ) {
      onChange({
        target: {
          name: "checkoutTtlBeforeReleasingFunds",
          value: DEFAULT_CHECKOUT_TTL_BEFORE_RELEASING_FUNDS_HOURS,
        },
      });
    }
  };

  return (
    <Box data-test-id="channel-payments-checkout-section">
      <DefaultTransactionFlowStrategy
        value={data.defaultTransactionFlowStrategy}
        onValueChange={value =>
          onChange({
            target: { name: "defaultTransactionFlowStrategy", value },
          })
        }
        disabled={disabled}
      />
      <MarkAsPaid
        value={data.markAsPaidStrategy}
        onValueChange={value =>
          onChange({
            target: { name: "markAsPaidStrategy", value },
          })
        }
        disabled={disabled}
      />
      <ChannelSettingToggleRow
        testId="channel-release-funds-expired-checkouts"
        title={<FormattedMessage {...messages.releaseFundsLabel} />}
        description={<FormattedMessage {...messages.releaseFundsDescription} />}
        pressed={releaseFundsEnabled}
        disabled={disabled}
        onPressedChange={setReleaseFundsEnabled}
      >
        {releaseFundsEnabled ? (
          <ChannelSettingNestedField>
            <Text size={3} fontWeight="medium">
              <FormattedMessage {...messages.releaseFundsAfterLabel} />
            </Text>
            <Box display="flex" alignItems="center" gap={2}>
              <Box __width="88px">
                <Input
                  name="checkoutTtlBeforeReleasingFunds"
                  data-test-id="checkout-ttl-before-releasing-funds-input"
                  type="number"
                  min={1}
                  value={
                    data.checkoutTtlBeforeReleasingFunds ??
                    DEFAULT_CHECKOUT_TTL_BEFORE_RELEASING_FUNDS_HOURS
                  }
                  error={!!formErrors.checkoutTtlBeforeReleasingFunds}
                  disabled={disabled}
                  onChange={onChange}
                />
              </Box>
              <Text size={3} color="default2">
                <FormattedMessage {...messages.releaseFundsAfterUnit} />
              </Text>
            </Box>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.releaseFundsAfterHint} />
            </Text>
          </ChannelSettingNestedField>
        ) : null}
      </ChannelSettingToggleRow>
      <ChannelSettingToggleRow
        testId="automatically-complete-checkouts-checkbox"
        title={<FormattedMessage {...messages.automaticallyCompleteCheckoutsLabel} />}
        description={<FormattedMessage {...messages.automaticallyCompleteCheckoutsDescription} />}
        pressed={data.automaticallyCompleteCheckouts}
        disabled={disabled}
        onPressedChange={value =>
          onChange({
            target: { name: "automaticallyCompleteCheckouts", value },
          })
        }
        notice={
          !data.automaticallyCompleteCheckouts && savedAutomaticallyCompleteCheckouts ? (
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Box flexShrink="0" paddingTop={0.5}>
                <CircleAlertIcon size={16} />
              </Box>
              <Text size={2}>
                <FormattedMessage {...messages.automaticCompletionDisabledInfo} />
              </Text>
            </Box>
          ) : null
        }
      >
        {data.automaticallyCompleteCheckouts ? (
          <AutomaticallyCompleteCheckoutsFields
            isChecked={data.automaticallyCompleteCheckouts}
            hasError={!!formErrors.automaticCompletionDelay}
            disabled={disabled}
            delay={data.automaticCompletionDelay}
            cutOffDate={data.automaticCompletionCutOffDate}
            cutOffTime={data.automaticCompletionCutOffTime}
            cutOffDateError={!!formErrors.automaticCompletionCutOffDate}
            savedIsEnabled={savedAutomaticallyCompleteCheckouts}
            savedCutOffDate={savedAutomaticCompletionCutOffDate}
            savedCutOffTime={savedAutomaticCompletionCutOffTime}
            onDelayChange={onChange}
            onCutOffDateChange={onChange}
            onCutOffTimeChange={onChange}
          />
        ) : null}
      </ChannelSettingToggleRow>
      {isStagingSchema() ? (
        <AllowLegacyGiftCardUse
          isChecked={!!data.allowLegacyGiftCardUse}
          disabled={disabled}
          onCheckedChange={value =>
            onChange({
              target: { name: "allowLegacyGiftCardUse", value },
            })
          }
        />
      ) : null}
    </Box>
  );
};
