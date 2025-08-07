import CardSpacer from "@dashboard/components/CardSpacer";
import { Multiselect } from "@dashboard/components/Combobox";
import { ChannelFragment } from "@dashboard/graphql";
import { useChannelsSearch } from "@dashboard/hooks/useChannelsSearch";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Option } from "@saleor/macaw-ui-next";
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
  selectedChannels: Option[];
  allChannels?: ChannelFragment[];
}

const ChannelsSection = ({
  onChange,
  allChannels = [],
  selectedChannels,
}: ChannelsSectionProps) => {
  const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);
  const intl = useIntl();

  return (
    <>
      <FormattedMessage {...messages.subtitle} />
      <CardSpacer />

      <Multiselect
        label={intl.formatMessage(messages.selectFieldLabel)}
        name="channels"
        options={mapNodeToChoice(filteredChannels)}
        value={selectedChannels}
        onChange={onChange}
        fetchOptions={onQueryChange}
        data-test-id="select-channel-for-shipping-method"
      />
    </>
  );
};

export default ChannelsSection;
