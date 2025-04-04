import { infoMessages } from "@dashboard/extensions/messages";
import { DisabledIcon } from "@dashboard/icons/Disabled";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const AppDisabledInfo = () => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      <DisabledIcon height="10px" width="10px" />
      <Text size={2} color="default2">
        <FormattedMessage {...infoMessages.appDisabled} />
      </Text>
    </Box>
  );
};
