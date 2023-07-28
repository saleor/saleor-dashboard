import { TokenType } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";
import { getStatusColor } from "@dashboard/misc";
import { storageUtils } from "@dashboard/products/views/ProductList/filters";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

export const LegacyFiltersPresetsAlert = () => {
  const presets = storageUtils.getFilterTabs();
  const { formatMessage } = useIntl();

  const hasLegacyPresets = !presets.every(preset =>
    preset.data.match(`[${Object.values(TokenType)}][0-9].`),
  );

  if (hasLegacyPresets) {
    return (
      <Box
        __backgroundColor={getStatusColor("warning")}
        paddingX={7}
        paddingY={5}
        marginBottom={5}
      >
        <Text>{formatMessage(messages.alertText)}</Text>
      </Box>
    );
  }
  return null;
};

const messages = defineMessages({
  alertText: {
    defaultMessage:
      "You are using an old version of the filter presets. Update your presets to continue using filters.",
    description: "Alert text",
    id: "vBykp8",
  },
});
