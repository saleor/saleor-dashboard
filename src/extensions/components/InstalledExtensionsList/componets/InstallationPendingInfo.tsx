import { infoMessages } from "@dashboard/extensions/messages";
import { CircularProgress } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const InstallationPendingInfo = () => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      <CircularProgress size={10} />
      <Text size={2} color="default2">
        <FormattedMessage {...infoMessages.installationPending} />
      </Text>
    </Box>
  );
};
