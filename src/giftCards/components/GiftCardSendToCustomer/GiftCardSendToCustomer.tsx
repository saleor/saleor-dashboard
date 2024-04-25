import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import SingleSelectField from "@dashboard/components/SingleSelectField";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import GiftCardCustomerSelectField from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { GiftCardCreateFormCustomer } from "@dashboard/giftCards/GiftCardCreateDialog/types";
import { FormChange } from "@dashboard/hooks/useForm";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { mapSlugNodeToChoice } from "@dashboard/utils/maps";
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
      <VerticalSpacer />
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
          <VerticalSpacer />
          <GiftCardCustomerSelectField
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            disabled={disabled}
          />
          <VerticalSpacer />
          <Label text={intl.formatMessage(messages.customerSubtitle)} />
          <VerticalSpacer />
          <SingleSelectField
            choices={channelsChoices}
            name="channelSlug"
            label={intl.formatMessage(messages.channelSelectLabel)}
            value={selectedChannelSlug || channel?.slug}
            onChange={change}
          />
          <VerticalSpacer />
          <Label text={intl.formatMessage(messages.customerChannelSubtitle)} />
          <VerticalSpacer />
        </>
      )}
      <VerticalSpacer />
    </>
  );
};

export default GiftCardSendToCustomer;
