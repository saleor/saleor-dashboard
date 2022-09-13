import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@saleor/graphql";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "../messages";
import { ChannelsList } from "./ChannelsList";
import { ChannelsListItem } from "./ChannelsListItem";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

interface AvailabilityCardProps {
  items:
    | ProductVariantCreateDataQuery["product"]["channelListings"]
    | ProductVariantFragment["channelListings"];
  productChannelListings: ProductVariantCreateDataQuery["product"]["channelListings"];
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

  return (
    <CardContainer cardTitle={children}>
      <ChannelsList summary={channelListSummary}>
        {items.map(({ channel }) => (
          <ChannelsListItem {...channel} listings={productChannelListings} />
        ))}
      </ChannelsList>
    </CardContainer>
  );
};
