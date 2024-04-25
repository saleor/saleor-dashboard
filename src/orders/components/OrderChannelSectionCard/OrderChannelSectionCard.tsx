import { channelUrl } from "@dashboard/channels/urls";
import CardTitle from "@dashboard/components/CardTitle";
import Link from "@dashboard/components/Link";
import Skeleton from "@dashboard/components/Skeleton";
import { ChannelFragment } from "@dashboard/graphql";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
  channel?: Pick<ChannelFragment, "id" | "name">;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = ({ channel }) => {
  const intl = useIntl();

  return (
    <Card data-test-id="order-sales-channel">
      <CardTitle
        title={intl.formatMessage({
          id: "aY0HAT",
          defaultMessage: "Sales channel",
          description: "section header",
        })}
      />
      <CardContent>
        {!channel ? (
          <Skeleton />
        ) : (
          <Typography>
            <Link href={channelUrl(channel.id) ?? ""} disabled={!channel.id}>
              {channel.name ?? "..."}
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
OrderChannelSectionCard.displayName = "OrderChannelSectionCard";
export default OrderChannelSectionCard;
