import CardSpacer from "@saleor/components/CardSpacer";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "@saleor/components/MultiAutocompleteSelectField";
import { ChannelFragment } from "@saleor/graphql";
import { useChannelsSearch } from "@saleor/hooks/useChannelsSearch";
import { FormChange } from "@saleor/hooks/useForm";
import { mapNodeToChoice } from "@saleor/utils/maps";
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
      />
    </>
  );
};

export default ChannelsSection;
