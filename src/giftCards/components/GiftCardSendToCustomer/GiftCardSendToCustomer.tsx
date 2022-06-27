import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import SingleSelectField from "@saleor/components/SingleSelectField";
import GiftCardCustomerSelectField from "@saleor/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { GiftCardCreateFormCustomer } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { FormChange } from "@saleor/hooks/useForm";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { mapSlugNodeToChoice } from "@saleor/utils/maps";
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

  useEffect(
    () => change({ target: { name: "channelSlug", value: channel?.slug } }),
    [],
  );

  const intl = useIntl();

  return (
    <>
      <VerticalSpacer />
      <ControlledCheckbox
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
