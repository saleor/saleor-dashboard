import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import SingleSelectField from "@dashboard/components/SingleSelectField";
import GiftCardCustomerSelectField from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { GiftCardCreateFormCustomer } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { FormChange } from "@dashboard/hooks/useForm";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { giftCardSendToCustomerMessages as messages } from "./messages";

interface GiftCardSendToCustomerProps {
  selectedChannelSlug: string;
  change: FormChange;
  sendToCustomerSelected: boolean;
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

const GiftCardSendToCustomer: React.FC<GiftCardSendToCustomerProps> = ({
  change,
  sendToCustomerSelected,
  selectedChannelSlug,
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}) => {
  const { channel, availableChannels } = useAppChannel(false);
  const channelsChoices = mapSlugNodeToChoice(availableChannels);

  useEffect(() => change({ target: { name: "channelSlug", value: channel?.slug } }), []);

  const intl = useIntl();

  return (
    <>
      <ControlledCheckbox
        data-test-id="send-to-customer-section"
        name={"sendToCustomerSelected"}
        label={intl.formatMessage(messages.sendToCustomerSelectedLabel)}
        checked={sendToCustomerSelected}
        onChange={change}
        disabled={disabled}
      />
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
            <SingleSelectField
              choices={channelsChoices}
              name="channelSlug"
              label={intl.formatMessage(messages.channelSelectLabel)}
              value={selectedChannelSlug || channel?.slug}
              onChange={change}
            />
            <Label text={intl.formatMessage(messages.customerChannelSubtitle)} />
          </Box>
        </>
      )}
    </>
  );
};

export default GiftCardSendToCustomer;
