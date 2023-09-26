import { DashboardCard } from "@dashboard/components/Card";
import { Box, Button } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface CreateVariantTitleProps {
  onManageClick: () => void;
  disabled: boolean;
}

export const CreateVariantTitle: React.FC<CreateVariantTitleProps> = ({
  onManageClick,
  disabled,
}) => {
  const intl = useIntl();

  return (
    <DashboardCard.Title>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {intl.formatMessage(messages.title)}
        <Button
          variant="secondary"
          disabled={disabled}
          data-test-id="manage-channels-button"
          onClick={onManageClick}
        >
          {intl.formatMessage(messages.manageButtonText)}
        </Button>
      </Box>
    </DashboardCard.Title>
  );
};
