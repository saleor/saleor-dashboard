import { Button, Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
  selectedChannelName?: string;
  onSelectClick: () => void;
  disabled: boolean;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = props => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Sales channel",
          description: "section header"
        })}
        toolbar={
          <Button
            color="primary"
            variant="text"
            disabled={props.disabled}
            onClick={props.onSelectClick}
          >
            {intl.formatMessage(buttonMessages.edit)}
          </Button>
        }
      />
      <CardContent>
        {props.selectedChannelName === undefined ? (
          <Skeleton />
        ) : props.selectedChannelName === null ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Channel not set"
              description="customer is not set in draft order"
              id="orderChannelNotSet"
            />
          </Typography>
        ) : (
          <Typography>{props.selectedChannelName}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
OrderChannelSectionCard.displayName = "OrderChannelSectionCard";
export default OrderChannelSectionCard;
