import { channelUrl } from "@dashboard/channels/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { ChannelFragment } from "@dashboard/graphql";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
  channel?: Pick<ChannelFragment, "id" | "name">;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = ({ channel }) => {
  const intl = useIntl();

  return (
    <DashboardCard data-test-id="order-sales-channel">
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "aY0HAT",
          defaultMessage: "Sales channel",
          description: "section header",
        })}
      />
      <DashboardCard.Content>
        {!channel ? (
          <Skeleton />
        ) : (
          <Text>
            <Link href={channelUrl(channel.id) ?? ""} disabled={!channel.id}>
              {channel.name ?? "..."}
            </Link>
          </Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
OrderChannelSectionCard.displayName = "OrderChannelSectionCard";
export default OrderChannelSectionCard;
