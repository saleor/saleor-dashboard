import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import { Divider } from "@dashboard/components/Divider";
import { FormsetData } from "@dashboard/hooks/useFormset";
import React from "react";

import { ProductChannelListing } from "./../types";
import { ChannelsListItem } from "./ChannelsListItem";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  allAvailableListings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
  productChannelListings: ProductChannelListing;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  allAvailableListings,
  productChannelListings,
  children,
}) => {
  if (allAvailableListings.length === 0) {
    return <CardContainer cardTitle={children}>{}</CardContainer>;
  }

  const listingIds = allAvailableListings.map(lst => lst.id);
  const filteredListings: ProductChannelListing =
    productChannelListings?.filter((channel: ProductChannelListing[0]) =>
      listingIds.includes(channel.channel.id),
    );

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
