import { infoMessages } from "@dashboard/extensions/messages";
import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const FailedInstallationInfo = () => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      <ErrorCircle />
      <Text size={2} color="default2">
        <FormattedMessage {...infoMessages.installationFailed} />
      </Text>
    </Box>
  );
};
