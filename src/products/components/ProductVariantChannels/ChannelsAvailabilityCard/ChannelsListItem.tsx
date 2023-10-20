// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";
import { Channel, ProductChannelListing } from "./../types";

type ChannelsListItemProps = Pick<Channel, "id" | "name"> & {
  listings: ProductChannelListing;
};

export const ChannelsListItem: React.FC<ChannelsListItemProps> = ({
  id,
  name,
  listings,
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const getItemSubtitle = (channelId: string) => {
    const channelListing = listings.find(
      ({ channel }) => channel.id === channelId,
    );

    const { isPublished, publicationDate } = channelListing;

    if (!isPublished) {
      return intl.formatMessage(messages.itemSubtitleHidden);
    }

    return intl.formatMessage(messages.itemSubtitlePublished, {
      publicationDate: localizeDate(publicationDate),
    });
  };

  return (
    <React.Fragment key={id}>
      <Divider />
      <DashboardCard.Content paddingY={6}>
        <Text
          as="p"
          variant="bodyStrong"
          size="small"
          data-test-id={`channels-variant-availability-item-title-${id}`}
        >
          {name}
        </Text>
        <Text
          size="small"
          data-test-id={`channels-variant-availability-item-subtitle-${id}`}
        >
          {getItemSubtitle(id)}
        </Text>
      </DashboardCard.Content>
    </React.Fragment>
  );
};
