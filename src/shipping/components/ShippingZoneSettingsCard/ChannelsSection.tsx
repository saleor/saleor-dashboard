import { useChannelsSearch } from "@saleor/channels/components/ChannelsAvailabilityDialog/utils";
import { Channels_channels } from "@saleor/channels/types/Channels";
import CardSpacer from "@saleor/components/CardSpacer";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  subtitle: {
    defaultMessage:
      "Assign channels to this shipping zone so we know which orders will be supported",
    description: "ChannelsSection subtitle"
  },
  selectFieldLabel: {
    defaultMessage: "Channel",
    description: "ChannelsSection select field label",
    id: "shippingZoneChannels.autocomplete.label"
  },
  selectFieldPlaceholder: {
    defaultMessage: "Add Channel",
    description: "ChannelsSection select field placeholder"
  }
});

interface ChannelsSectionProps {
  onChange: FormChange;
  selectedChannels: string[];
  allChannels?: Channels_channels[];
  channelsDisplayValues: MultiAutocompleteChoiceType[];
}

const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  onChange,
  allChannels = [],
  selectedChannels,
  channelsDisplayValues
}) => {
  const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);

  const intl = useIntl();

  return (
    <>
      <FormattedMessage {...messages.subtitle} />
      <CardSpacer />
      <MultiAutocompleteSelectField
        choices={mapNodeToChoice(filteredChannels)}
        displayValues={channelsDisplayValues}
        fetchChoices={onQueryChange}
        hasMore={false}
        label={intl.formatMessage(messages.selectFieldLabel)}
        loading={false}
        name="channels"
        onChange={onChange}
        placeholder={intl.formatMessage(messages.selectFieldPlaceholder)}
        value={selectedChannels}
      />
    </>
  );
};

export default ChannelsSection;
