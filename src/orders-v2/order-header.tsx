import { channelUrl } from "@dashboard/channels/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import Link from "@dashboard/components/Link";
import { OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import moment from "moment-timezone";
import React from "react";
import { useIntl } from "react-intl";

import { StatusPill } from "./status-pill";

interface Props {
  status: OrderStatus;
  orderNumber: string;
  created: string;
  channel: {
    id: string;
    name: string;
  };
}

export const OrderHeader = ({ status, orderNumber, created, channel }: Props) => {
  const intl = useIntl();

  const { localized, status: orderStatus } = transformOrderStatus(status, intl);

  const formattedDate = moment(created).format("Do MMM, YY HH:mm");

  return (
    <>
      <Box display="flex" alignItems="center" width="100%" gap={3}>
        <Button icon={<Package />} variant="secondary" alignSelf="start" />
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={3}>
            <Text size={6} fontWeight="bold">
              {intl.formatMessage(
                {
                  defaultMessage: "Order #{orderNumber}",
                  id: "AqXzM2",
                },
                { orderNumber },
              )}
            </Text>
            <StatusPill status={orderStatus}>{localized}</StatusPill>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Text color="default2" size={2}>
              {intl.formatMessage(
                {
                  defaultMessage: "Created {formattedDate}",
                  id: "aGx3Z5",
                },
                { formattedDate },
              )}
            </Text>
            <Text color="default2" size={2}>
              |
            </Text>
            <Text size={2}>
              {intl.formatMessage(
                {
                  defaultMessage: "Channel {channelNameLink}",
                  id: "VxBOta",
                },
                {
                  channelNameLink: <Link href={channelUrl(channel.id)}>{channel.name}</Link>,
                },
              )}
            </Text>
          </Box>
        </Box>
      </Box>
      {/* TODO: add menu items */}
      <TopNav.Menu dataTestId="menu" items={[]} />
    </>
  );
};
