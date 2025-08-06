import { DashboardCard } from "@dashboard/components/Card";
import { Accordion, Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface CreateVariantTitleProps {
  onManageClick: () => void;
  disabled: boolean;
  availabilityCount: Record<string, number | undefined>;
  isEmpty: boolean;
}

export const CreateVariantTitle = ({
  onManageClick,
  disabled,
  availabilityCount,
  isEmpty,
}: CreateVariantTitleProps) => {
  const intl = useIntl();
  const getCaptionText = () => {
    if (isEmpty) {
      return intl.formatMessage(messages.noItemsAvailable);
    }

    return intl.formatMessage(messages.subtitle, availabilityCount);
  };

  return (
    <DashboardCard.Header>
      <DashboardCard.Title>
        <Box display="grid" gap={2}>
          {intl.formatMessage(messages.title)}
          <Text size={2} color="default2">
            {getCaptionText()}
          </Text>
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Toolbar>
        <Button
          variant="secondary"
          disabled={disabled}
          data-test-id="manage-channels-button"
          onClick={onManageClick}
        >
          {intl.formatMessage(messages.manageButtonText)}
        </Button>
        <Accordion.Trigger>
          <Accordion.TriggerButton dataTestId="expand-icon" />
        </Accordion.Trigger>
      </DashboardCard.Toolbar>
    </DashboardCard.Header>
  );
};
