import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";

export interface ChannelsAvailabilityWrapperProps {
  selectedChannelsCount: number;
  allChannelsCount: number;
  children: React.ReactNode;
  managePermissions: PermissionEnum[];
  openModal: () => void;
}

export const ChannelsAvailabilityCardWrapper: React.FC<
  ChannelsAvailabilityWrapperProps
> = props => {
  const {
    selectedChannelsCount,
    allChannelsCount,
    children,
    managePermissions,
    openModal,
  } = props;
  const intl = useIntl();
  const channelsAvailabilityText = intl.formatMessage(
    {
      id: "AD1PlC",
      defaultMessage:
        "In {selectedChannelsCount} out of {allChannelsCount, plural, one {# channel} other {# channels}}",
      description: "channels availability text",
    },
    {
      allChannelsCount,
      selectedChannelsCount,
    },
  );

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between">
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <div>
              {intl.formatMessage({
                id: "5A6/2C",
                defaultMessage: "Availability",
                description: "section header",
              })}
            </div>
            {!!channelsAvailabilityText && (
              <Text
                size={2}
                color="default2"
                data-test-id="product-available-in-channels-text"
              >
                {channelsAvailabilityText}
              </Text>
            )}
          </Box>
          <RequirePermissions requiredPermissions={managePermissions}>
            <Button
              onClick={openModal}
              data-test-id="channels-availability-manage-button"
              type="button"
              variant="secondary"
            >
              {intl.formatMessage({
                id: "2i81/P",
                defaultMessage: "Manage",
                description: "section header button",
              })}
            </Button>
          </RequirePermissions>
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content gap={1} display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" gap={5}>
          {children}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
