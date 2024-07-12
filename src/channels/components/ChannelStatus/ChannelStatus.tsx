import { DashboardCard } from "@dashboard/components/Card";
import { Button, Text } from "@saleor/macaw-ui-next";
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
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "TSJRiZ",
          defaultMessage: "Channel Status",
          description: "channel status title",
        })}
      </DashboardCard.Title>

      <DashboardCard.Content>
        <Text size={2} fontWeight="light" className={classes.label}>
          <FormattedMessage id="+tIkAe" defaultMessage="Status" description="status" />
        </Text>
        <Text>
          {isActive ? (
            <FormattedMessage id="QiN4hv" defaultMessage="Active" description="active" />
          ) : (
            <FormattedMessage id="X8qjg3" defaultMessage="Inactive" description="inactive" />
          )}
        </Text>
        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => updateChannelStatus()}
          marginTop={2}
        >
          {isActive ? (
            <FormattedMessage id="MHVglr" defaultMessage="Deactivate" description="deactivate" />
          ) : (
            <FormattedMessage id="MQwT1W" defaultMessage="Activate" description="activate" />
          )}
        </Button>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ChannelStatus.displayName = "ChannelStatus";
export default ChannelStatus;
