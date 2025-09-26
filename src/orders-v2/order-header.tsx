import { channelUrl } from "@dashboard/channels/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import { OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { Box, BoxProps, Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderDetailsHeaderIcon } from "./icons/order-details-header";
import { StatusPill } from "./status-pill";
import { UnderlineLink } from "./underline-link";

interface Props extends BoxProps {
  status: OrderStatus;
  orderNumber: string;
  created: string;
  channel: {
    id: string;
    name: string;
  };
}

export const OrderHeader = ({ status, orderNumber, created, channel, ...props }: Props) => {
  const intl = useIntl();

  const { localized, status: orderStatus } = transformOrderStatus(status, intl);

  const formattedDate = intl.formatDate(created, {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box display="flex" width="100%" {...props}>
      <Box display="flex" alignItems="center" width="100%" gap={3}>
        <Button icon={<OrderDetailsHeaderIcon />} variant="secondary" alignSelf="start" />
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
                  defaultMessage: "Channel: {channelNameLink}",
                  id: "QpetOV",
                },
                {
                  channelNameLink: (
                    <UnderlineLink to={channelUrl(channel.id)}>{channel.name}</UnderlineLink>
                  ),
                },
              )}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box alignSelf="start" gap={2}>
        {/* TODO: add menu items */}
        <TopNav.Menu dataTestId="menu" items={[]} />
      </Box>
    </Box>
  );
};
