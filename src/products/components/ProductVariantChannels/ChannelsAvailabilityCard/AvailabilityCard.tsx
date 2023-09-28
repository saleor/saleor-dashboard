import { Divider } from "@dashboard/components/Divider";
import React from "react";

import { Channel, ProductChannelListing } from "./../types";
import { ChannelsListItem } from "./ChannelsListItem";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  items: Channel[];
  productChannelListings: ProductChannelListing;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  items,
  productChannelListings,
  children,
}) => {
  if (items.length === 0) {
    return <CardContainer cardTitle={children}>{}</CardContainer>;
  }

  return (
    <CardContainer cardTitle={children}>
      {items.map(channel => (
        <ChannelsListItem
          {...channel}
          listings={productChannelListings}
          key={channel.id}
        />
      ))}
      <Divider />
    </CardContainer>
  );
};
