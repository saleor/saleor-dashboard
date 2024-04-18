// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Divider } from "@dashboard/components/Divider";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface ChannelsListItemProps {
  id: string;
  name: string;
  isPublished: boolean;
  publicationDate: string;
}

export const ChannelsListItem: React.FC<ChannelsListItemProps> = ({
  id,
  name,
  isPublished,
  publicationDate,
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const getItemSubtitle = () => {
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
          size={3}
          fontWeight="bold"
          data-test-id={`channels-variant-availability-item-title-${id}`}
        >
          {name}
        </Text>
        <Text size={3} data-test-id={`channels-variant-availability-item-subtitle-${id}`}>
          {getItemSubtitle()}
        </Text>
      </DashboardCard.Content>
    </React.Fragment>
  );
};
