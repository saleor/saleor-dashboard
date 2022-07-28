import { Card, CardContent, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelStatusProps {
  isActive: boolean;
  disabled: boolean;
  updateChannelStatus: () => void;
}

export const ChannelStatus: React.FC<ChannelStatusProps> = ({
  disabled,
  isActive,
  updateChannelStatus,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "TSJRiZ",
          defaultMessage: "Channel Status",
          description: "channel status title",
        })}
      />
      <CardContent>
        <Typography variant="caption" className={classes.label}>
          <FormattedMessage
            id="+tIkAe"
            defaultMessage="Status"
            description="status"
          />
        </Typography>
        <Typography>
          {isActive ? (
            <FormattedMessage
              id="QiN4hv"
              defaultMessage="Active"
              description="active"
            />
          ) : (
            <FormattedMessage
              id="X8qjg3"
              defaultMessage="Inactive"
              description="inactive"
            />
          )}
        </Typography>
        <Button
          className={classes.activeBtn}
          disabled={disabled}
          onClick={() => updateChannelStatus()}
        >
          {isActive ? (
            <FormattedMessage
              id="MHVglr"
              defaultMessage="Deactivate"
              description="deactivate"
            />
          ) : (
            <FormattedMessage
              id="MQwT1W"
              defaultMessage="Activate"
              description="activate"
            />
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

ChannelStatus.displayName = "ChannelStatus";
export default ChannelStatus;
