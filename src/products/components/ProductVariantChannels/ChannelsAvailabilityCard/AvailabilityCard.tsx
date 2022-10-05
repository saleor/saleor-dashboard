import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";
import { Channel, ProductChannelListing } from "./../types";
import { ChannelsList } from "./ChannelsList";
import { ChannelsListItem } from "./ChannelsListItem";
import { NotAvailable } from "./NotAvailable";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  items: Channel[];
  productChannelListings: ProductChannelListing;
  availabilityCount: Record<string, number>;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  availabilityCount,
  items,
  productChannelListings,
  children,
}) => {
  const intl = useIntl();
  const channelListSummary = intl.formatMessage(
    messages.subtitle,
    availabilityCount,
  );

  if (items.length === 0) {
    return (
      <CardContainer cardTitle={children}>
        <NotAvailable />
      </CardContainer>
    );
  }

  return (
    <CardContainer cardTitle={children}>
      <ChannelsList summary={channelListSummary}>
        {items.map(channel => (
          <ChannelsListItem {...channel} listings={productChannelListings} />
        ))}
      </ChannelsList>
    </CardContainer>
  );
};
