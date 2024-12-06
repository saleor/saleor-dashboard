import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import GiftCardCustomerSelectField from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { GiftCardCreateFormCustomer } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { FormChange } from "@dashboard/hooks/useForm";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, Select, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardSendToCustomerMessages as messages } from "./messages";

interface GiftCardSendToCustomerProps {
  selectedChannelSlug: string;
  change: FormChange;
  sendToCustomerSelected: boolean;
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

const GiftCardSendToCustomer = ({
  change,
  sendToCustomerSelected,
  selectedChannelSlug,
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}: GiftCardSendToCustomerProps) => {
  const { channel, availableChannels } = useAppChannel(false);
  const channelsChoices = mapSlugNodeToChoice(availableChannels);

  useEffect(() => change({ target: { name: "channelSlug", value: channel?.slug } }), []);

  const intl = useIntl();

  return (
    <>
      <Checkbox
        data-test-id="send-to-customer-section"
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
              value={selectedChannelSlug || channel?.slug}
              onChange={value => change({ target: { name: "channelSlug", value } })}
            />

            <Label text={intl.formatMessage(messages.customerChannelSubtitle)} />
          </Box>
        </>
      )}
    </>
  );
};

export default GiftCardSendToCustomer;
