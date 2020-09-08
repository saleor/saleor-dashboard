import { Button, Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface DraftOrderChannelSectionCardProps {
  selectedChannelName: string;
  onSelectClick: () => void;
  disabled: boolean;
}

export const DraftOrderChannelSectionCard: React.FC<DraftOrderChannelSectionCardProps> = ({
  disabled,
  onSelectClick,
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
        toolbar={
          <Button
            color="primary"
            variant="text"
            disabled={disabled}
            onClick={onSelectClick}
          >
            {intl.formatMessage(buttonMessages.edit)}
          </Button>
        }
      />
      <CardContent>
        {selectedChannelName === undefined ? (
          <Skeleton />
        ) : selectedChannelName === null ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Channel not set"
              description="customer is not set in draft order"
              id="orderChannelNotSet"
            />
          </Typography>
        ) : (
          <Typography>{selectedChannelName}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
DraftOrderChannelSectionCard.displayName = "DraftOrderChannelSectionCard";
export default DraftOrderChannelSectionCard;
