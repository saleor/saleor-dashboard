import CardSpacer from "@dashboard/components/CardSpacer";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "@dashboard/components/MultiAutocompleteSelectField";
import { ChannelFragment } from "@dashboard/graphql";
import { useChannelsSearch } from "@dashboard/hooks/useChannelsSearch";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  subtitle: {
    id: "avj76v",
    defaultMessage:
      "Assign channels to this shipping zone so we know which orders will be supported",
    description: "ChannelsSection subtitle",
  },
  selectFieldLabel: {
    id: "mLZMb6",
    defaultMessage: "Channel",
    description: "ChannelsSection select field label",
  },
  selectFieldPlaceholder: {
    id: "cnvyqW",
    defaultMessage: "Add Channel",
    description: "ChannelsSection select field placeholder",
  },
});

interface ChannelsSectionProps {
  onChange: FormChange;
  selectedChannels: string[];
  allChannels?: ChannelFragment[];
  channelsDisplayValues: MultiAutocompleteChoiceType[];
}

const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  onChange,
  allChannels = [],
  selectedChannels,
  channelsDisplayValues,
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
        testId="channels"
        data-test-id="select-channel-for-shipping-method"
      />
    </>
  );
};

export default ChannelsSection;
