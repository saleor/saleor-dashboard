import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import RequirePermissions from "@saleor/components/RequirePermissions";
import { PermissionEnum } from "@saleor/graphql";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityWrapperProps {
  selectedChannelsCount: number;
  allChannelsCount: number;
  children: React.ReactNode;
  managePermissions: PermissionEnum[];
  openModal: () => void;
}

export const ChannelsAvailabilityWrapper: React.FC<ChannelsAvailabilityWrapperProps> = props => {
  const {
    selectedChannelsCount,
    allChannelsCount,
    children,
    managePermissions,
    openModal
  } = props;
  const intl = useIntl();
  const classes = useStyles({});
  const channelsAvailabilityText = intl.formatMessage(
    {
      defaultMessage:
        "Available at {selectedChannelsCount} out of {allChannelsCount, plural, one {# channel} other {# channels}}",

      description: "channels availability text"
    },
    {
      allChannelsCount,
      selectedChannelsCount
    }
  );

  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Availability",
            description: "section header"
          })}
          toolbar={
            <RequirePermissions requiredPermissions={managePermissions}>
              <Button
                onClick={openModal}
                data-test-id="channels-availability-manage-button"
              >
                {intl.formatMessage({
                  defaultMessage: "Manage",
                  description: "section header button"
                })}
              </Button>
            </RequirePermissions>
          }
        />
        <CardContent className={classes.card}>
          {!!channelsAvailabilityText && (
            <>
              <Typography className={classes.channelInfo}>
                {channelsAvailabilityText}
              </Typography>
              <Hr className={classes.hr} />
            </>
          )}
          {children}
        </CardContent>
      </Card>
    </>
  );
};

export default ChannelsAvailabilityWrapper;
