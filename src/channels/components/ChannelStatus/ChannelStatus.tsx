import { Button, Card, CardContent, Typography } from "@material-ui/core";
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
  updateChannelStatus
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Channel Status",
          description: "channel status title"
        })}
      />
      <CardContent>
        <Typography variant="caption" className={classes.label}>
          <FormattedMessage defaultMessage="Status" description="status" />
        </Typography>
        <Typography>
          {isActive ? (
            <FormattedMessage defaultMessage="Active" description="active" />
          ) : (
            <FormattedMessage
              defaultMessage="Inactive"
              description="inactive"
            />
          )}
        </Typography>
        <Button
          color="primary"
          className={classes.activeBtn}
          disabled={disabled}
          onClick={() => updateChannelStatus()}
        >
          {isActive ? (
            <FormattedMessage
              defaultMessage="Deactivate"
              description="deactivate"
            />
          ) : (
            <FormattedMessage
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
