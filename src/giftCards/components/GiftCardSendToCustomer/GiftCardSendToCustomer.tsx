import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import SingleSelectField, {
  Choices
} from "@saleor/components/SingleSelectField";
import GiftCardCustomerSelectField from "@saleor/giftCards/GiftCardCreateDialog/GiftCardCustomerSelectField";
import { GiftCardCreateFormCustomer } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { FormChange } from "@saleor/hooks/useForm";
import Label from "@saleor/orders/components/OrderHistory/Label";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSendToCustomerMessages as messages } from "./messages";

interface GiftCardSendToCustomerProps {
  channelsChoices: Choices;
  channel: string;
  change: FormChange;
  sendToCustomerSelected: boolean;
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
}

const GiftCardSendToCustomer: React.FC<GiftCardSendToCustomerProps> = ({
  channelsChoices,
  channel,
  change,
  sendToCustomerSelected,
  selectedCustomer,
  setSelectedCustomer
}) => {
  const intl = useIntl();

  return (
    <>
      <ControlledCheckbox
        name={"sendToCustomerSelected"}
        label={intl.formatMessage(messages.sendToCustomerSelectedLabel)}
        checked={sendToCustomerSelected}
        onChange={change}
      />
      {sendToCustomerSelected && (
        <>
          <VerticalSpacer spacing={2} />
          <GiftCardCustomerSelectField
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
          <VerticalSpacer />
          <Label text={intl.formatMessage(messages.customerSubtitle)} />
          <VerticalSpacer spacing={2} />
          <SingleSelectField
            choices={channelsChoices}
            name="channel"
            label={intl.formatMessage(messages.channelSelectLabel)}
            value={channel}
            onChange={change}
          />
          <VerticalSpacer />
          <Label text={intl.formatMessage(messages.customerChannelSubtitle)} />
        </>
      )}
    </>
  );
};

export default GiftCardSendToCustomer;
