import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import { Divider } from "@dashboard/components/Divider";
import { FormsetData } from "@dashboard/hooks/useFormset";
import React from "react";

import { ProductChannelListing } from "./../types";
import { ChannelsListItem } from "./ChannelsListItem";
import { useFilteredChannelListing } from "./useFilteredChannelListing";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  allAvailableListings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
  productChannelListings: ProductChannelListing | undefined;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  allAvailableListings,
  productChannelListings,
  children,
}) => {
  const filteredListings = useFilteredChannelListing({
    allAvailableListings,
    channelListing: productChannelListings,
  });

  if (allAvailableListings.length === 0) {
    return <CardContainer cardTitle={children}>{null}</CardContainer>;
  }

  return (
    <CardContainer cardTitle={children}>
      {filteredListings.map((listing: ProductChannelListing[0]) => (
        <ChannelsListItem
          {...listing}
          id={listing.channel.id}
          name={listing.channel.name}
          key={listing.channel.id}
        />
      ))}
      <Divider />
    </CardContainer>
  );
};
