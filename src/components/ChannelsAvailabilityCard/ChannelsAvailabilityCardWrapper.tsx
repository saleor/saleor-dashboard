import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import RequirePermissions from "@saleor/components/RequirePermissions";
import useUser from "@saleor/hooks/useUser";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityWrapperProps {
  selectedChannelsCount: number;
  allChannelsCount: number;
  openModal: () => void;
  children: React.ReactNode;
}

export const ChannelsAvailabilityWrapper: React.FC<ChannelsAvailabilityWrapperProps> = props => {
  const {
    selectedChannelsCount,
    allChannelsCount,
    openModal,
    children
  } = props;
  const intl = useIntl();
  const classes = useStyles({});
  const { user } = useUser();
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
            <RequirePermissions
              userPermissions={user?.userPermissions || []}
              requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
            >
              <Button
                color="primary"
                onClick={openModal}
                data-test-id="channels-availiability-manage-button"
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
