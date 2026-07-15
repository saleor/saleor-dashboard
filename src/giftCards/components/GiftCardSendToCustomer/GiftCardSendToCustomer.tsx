import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { Callout } from "@dashboard/components/Callout/Callout";
import { GiftCardCustomerSelectField } from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { type GiftCardCreateFormCustomer } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { type FormChange } from "@dashboard/hooks/useForm";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, Select, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardSendToCustomerMessages as messages } from "./messages";

interface GiftCardSendToCustomerProps {
  balanceCurrency: string | null;
  change: FormChange;
  disabled?: boolean;
  selectedChannelSlug: string | undefined;
  selectedCustomer: GiftCardCreateFormCustomer;
  sendToCustomerSelected: boolean;
  set: (data: Partial<{ channelSlug: string }>) => void;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
}

export const GiftCardSendToCustomer = ({
  balanceCurrency,
  change,
  disabled = false,
  selectedChannelSlug,
  selectedCustomer,
  sendToCustomerSelected,
  set,
  setSelectedCustomer,
}: GiftCardSendToCustomerProps) => {
  const { channel, availableChannels } = useAppChannel(false);
  const channelsChoices = mapSlugNodeToChoice(availableChannels);
  const resolvedChannelSlug = selectedChannelSlug || channel?.slug || "";

  useEffect(() => {
    if (!sendToCustomerSelected || !channel?.slug || selectedChannelSlug) {
      return;
    }

    set({ channelSlug: channel.slug });
  }, [channel?.slug, selectedChannelSlug, sendToCustomerSelected, set]);

  const intl = useIntl();
  const selectedChannel = useMemo(
    () => availableChannels.find(({ slug }) => slug === resolvedChannelSlug),
    [availableChannels, resolvedChannelSlug],
  );
  const channelCurrency = selectedChannel?.currencyCode;
  const hasCurrencyMismatch =
    !!balanceCurrency && !!channelCurrency && channelCurrency !== balanceCurrency;

  return (
    <>
      <Checkbox
        data-test-id="send-to-customer-section"
        gap={3}
        name="sendToCustomerSelected"
        checked={sendToCustomerSelected}
        onCheckedChange={value => change({ target: { name: "sendToCustomerSelected", value } })}
        disabled={disabled}
      >
        <Text>
          <FormattedMessage {...messages.sendToCustomerSelectedLabel} />
        </Text>
      </Checkbox>
      {sendToCustomerSelected && (
        <>
          <Box display="grid" gap={2}>
            <GiftCardCustomerSelectField
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              disabled={disabled}
            />
            <Label text={intl.formatMessage(messages.customerSubtitle)} />
          </Box>

          <Box display="grid" gap={2}>
            <Select
              name="channelSlug"
              options={channelsChoices}
              label={intl.formatMessage(messages.channelSelectLabel)}
              value={resolvedChannelSlug}
              onChange={value => change({ target: { name: "channelSlug", value } })}
            />

            <Label text={intl.formatMessage(messages.customerChannelSubtitle)} />
          </Box>

          {balanceCurrency ? (
            <Box data-test-id="gift-card-currency-callout">
              <Callout
                type={hasCurrencyMismatch ? "warning" : "info"}
                title={
                  <Text size={2}>
                    {hasCurrencyMismatch ? (
                      <FormattedMessage
                        {...messages.currencyMismatchWarning}
                        values={{
                          channelCurrency,
                          giftCardCurrency: balanceCurrency,
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        {...messages.currencyRedemptionInfo}
                        values={{ currency: balanceCurrency }}
                      />
                    )}
                  </Text>
                }
              />
            </Box>
          ) : null}
        </>
      )}
    </>
  );
};
