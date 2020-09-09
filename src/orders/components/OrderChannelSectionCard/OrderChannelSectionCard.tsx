import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
  selectedChannelName: string;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = ({
  selectedChannelName
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Sales channel",
          description: "section header"
        })}
      />
      <CardContent>
        {selectedChannelName === undefined ? (
          <Skeleton />
        ) : (
          <Typography>{selectedChannelName}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
OrderChannelSectionCard.displayName = "OrderChannelSectionCard";
export default OrderChannelSectionCard;
