import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import {
  Choice,
  Choices,
  SingleSelectField
} from "@saleor/components/SingleSelectField";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface DraftOrderChannelSectionCardProps {
  channelsChoices: Choices;
  disabled: boolean;
  selectedChoice: Choice;
  onChange: (option: any) => void;
}

export const DraftOrderChannelSectionCard: React.FC<DraftOrderChannelSectionCardProps> = ({
  channelsChoices,
  selectedChoice,
  disabled,
  onChange
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
        {selectedChoice === undefined ? (
          <Skeleton />
        ) : selectedChoice === null ? (
          <Typography>
            <FormattedMessage
              defaultMessage="Channel not set"
              description="customer is not set in draft order"
              id="orderChannelNotSet"
            />
          </Typography>
        ) : (
          <SingleSelectField
            choices={channelsChoices}
            name="channels"
            label={intl.formatMessage({
              defaultMessage: "Select Channel",
              description: "input label"
            })}
            disabled={disabled}
            value={selectedChoice.value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      </CardContent>
    </Card>
  );
};
DraftOrderChannelSectionCard.displayName = "DraftOrderChannelSectionCard";
export default DraftOrderChannelSectionCard;
