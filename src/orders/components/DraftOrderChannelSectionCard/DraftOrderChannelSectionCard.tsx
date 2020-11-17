import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { useIntl } from "react-intl";

export interface DraftOrderChannelSectionCardProps {
  channelName: string;
}

export const DraftOrderChannelSectionCard: React.FC<DraftOrderChannelSectionCardProps> = ({
  channelName
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
        {!channelName ? <Skeleton /> : <Typography>{channelName}</Typography>}
      </CardContent>
    </Card>
  );
};
DraftOrderChannelSectionCard.displayName = "DraftOrderChannelSectionCard";
export default DraftOrderChannelSectionCard;
