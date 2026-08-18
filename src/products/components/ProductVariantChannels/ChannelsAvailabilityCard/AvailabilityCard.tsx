import { type IChannelPriceArgs, type VariantChannelPriceData } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import { Placeholder } from "@dashboard/components/Placeholder";
import { type FormsetData } from "@dashboard/hooks/useFormset";
import { type PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";
import { type ProductChannelListing } from "./../types";
import { ChannelsListItem } from "./ChannelsListItem";
import { useFilteredChannelListing } from "./useFilteredChannelListing";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  allAvailableListings: FormsetData<VariantChannelPriceData, IChannelPriceArgs>;
  productChannelListings: ProductChannelListing | undefined;
}

export const AvailabilityCard = ({
  allAvailableListings,
  productChannelListings,
  children,
}: PropsWithChildren<AvailabilityCardProps>) => {
  const filteredListings = useFilteredChannelListing({
    allAvailableListings,
    channelListing: productChannelListings,
  });

  if (allAvailableListings.length === 0) {
    return (
      <CardContainer cardTitle={children} defaultExpanded>
        <DashboardCard.Content paddingBottom={6} data-test-id="channel-availability-empty">
          <Placeholder>
            <FormattedMessage {...messages.noItemsAvailable} />
          </Placeholder>
        </DashboardCard.Content>
      </CardContainer>
    );
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
