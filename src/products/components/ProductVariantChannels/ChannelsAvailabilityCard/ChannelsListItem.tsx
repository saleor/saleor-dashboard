import { CardContent, Divider, Typography } from "@material-ui/core";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
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
      <CardContent>
        <Typography
          data-test-id={`channels-variant-availability-item-title-${id}`}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          data-test-id={`channels-variant-availability-item-subtitle-${id}`}
        >
          {getItemSubtitle(id)}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
};
