import { type ChannelErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { type FormData } from "./ChannelForm";
import { ChannelSettingNestedField, ChannelSettingToggleRow } from "./ChannelSettingToggleRow";
import { messages } from "./messages";
import { createOrderStatusPills } from "./orderStatusPills";

/** Default minutes when enabling expire-abandoned-orders. */
export const DEFAULT_EXPIRE_ORDERS_AFTER_MINUTES = 60;

interface ChannelOrdersSectionProps {
  data: FormData;
  disabled: boolean;
  errors: ChannelErrorFragment[];
  onChange: FormChange;
}

export const ChannelOrdersSection = ({
  data,
  disabled,
  errors,
  onChange,
}: ChannelOrdersSectionProps) => {
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["expireOrdersAfter", "deleteExpiredOrdersAfter", "allowUnpaidOrders"],
    errors,
  );
  const expireEnabled = (data.expireOrdersAfter ?? 0) > 0;

  const setExpireEnabled = (enabled: boolean) => {
    onChange({
      target: {
        name: "expireOrdersAfter",
        value: enabled ? data.expireOrdersAfter || DEFAULT_EXPIRE_ORDERS_AFTER_MINUTES : 0,
      },
    });
  };

  return (
    <Box data-test-id="channel-orders-section">
      <ChannelSettingToggleRow
        testId="channel-automatically-confirm-orders"
        title={<FormattedMessage {...messages.automaticallyConfirmAllNewOrdersLabel} />}
        description={
          <FormattedMessage
            {...messages.automaticallyConfirmAllNewOrdersDescription}
            values={createOrderStatusPills()}
          />
        }
        pressed={data.automaticallyConfirmAllNewOrders}
        disabled={disabled}
        onPressedChange={value =>
          onChange({
            target: { name: "automaticallyConfirmAllNewOrders", value },
          })
        }
      />
      <ChannelSettingToggleRow
        testId="channel-automatically-fulfill-gift-cards"
        title={<FormattedMessage {...messages.automaticallyFulfillNonShippableGiftCardLabel} />}
        description={
          <FormattedMessage
            {...messages.automaticallyFulfillNonShippableGiftCardDescription}
            values={createOrderStatusPills()}
          />
        }
        pressed={data.automaticallyFulfillNonShippableGiftCard}
        disabled={disabled}
        onPressedChange={value =>
          onChange({
            target: { name: "automaticallyFulfillNonShippableGiftCard", value },
          })
        }
      />
      <ChannelSettingToggleRow
        testId="channel-allow-unpaid-orders"
        title={<FormattedMessage {...messages.allowUnpaidOrdersLabel} />}
        description={<FormattedMessage {...messages.allowUnpaidOrdersDescription} />}
        pressed={data.allowUnpaidOrders}
        disabled={disabled}
        onPressedChange={value =>
          onChange({
            target: { name: "allowUnpaidOrders", value },
          })
        }
      />
      <ChannelSettingToggleRow
        testId="channel-expire-orders"
        title={
          <FormattedMessage {...messages.expireOrdersLabel} values={createOrderStatusPills()} />
        }
        description={<FormattedMessage {...messages.expireOrdersDescription} />}
        pressed={expireEnabled}
        disabled={disabled}
        onPressedChange={setExpireEnabled}
        notice={
          expireEnabled && data.automaticallyConfirmAllNewOrders ? (
            <Text size={2} color="default2" data-test-id="expire-orders-auto-confirm-notice">
              <FormattedMessage
                {...messages.expireOrdersAutoConfirmNotice}
                values={{
                  ...createOrderStatusPills(),
                  autoConfirm: (
                    <Text as="span" size={2} fontWeight="bold" color="default1">
                      <FormattedMessage {...messages.automaticallyConfirmAllNewOrdersLabel} />
                    </Text>
                  ),
                }}
              />
            </Text>
          ) : null
        }
      >
        {expireEnabled ? (
          <>
            <ChannelSettingNestedField>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.expireOrdersAfterLabel} />
              </Text>
              <Box display="flex" alignItems="center" gap={2}>
                <Box __width="88px">
                  <Input
                    name="expireOrdersAfter"
                    data-test-id="expire-orders-after-input"
                    type="number"
                    min={1}
                    value={data.expireOrdersAfter ?? DEFAULT_EXPIRE_ORDERS_AFTER_MINUTES}
                    error={!!formErrors.expireOrdersAfter}
                    disabled={disabled}
                    onChange={onChange}
                  />
                </Box>
                <Text size={3} color="default2">
                  <FormattedMessage {...messages.expireOrdersAfterUnit} />
                </Text>
              </Box>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.expireOrdersAfterHint} />
              </Text>
            </ChannelSettingNestedField>
            <ChannelSettingNestedField>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.deleteExpiredOrdersAfterLabel} />
              </Text>
              <Box display="flex" alignItems="center" gap={2}>
                <Box __width="88px">
                  <Input
                    name="deleteExpiredOrdersAfter"
                    data-test-id="delete-expired-order-input"
                    type="number"
                    min={1}
                    max={120}
                    value={data.deleteExpiredOrdersAfter}
                    error={!!formErrors.deleteExpiredOrdersAfter}
                    disabled={disabled}
                    onChange={onChange}
                  />
                </Box>
                <Text size={3} color="default2">
                  <FormattedMessage {...messages.deleteExpiredOrdersAfterUnit} />
                </Text>
              </Box>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.deleteExpiredOrdersAfterHint} />
              </Text>
            </ChannelSettingNestedField>
          </>
        ) : null}
      </ChannelSettingToggleRow>
    </Box>
  );
};
