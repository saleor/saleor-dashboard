import { TokenType } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";
import { getStatusColor } from "@dashboard/misc";
import { storageUtils } from "@dashboard/products/views/ProductList/filters";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

export const LegacyFiltersPresetsAlert = () => {
  const presets = storageUtils.getFilterTabs();
  const { formatMessage } = useIntl();

  const legacyPresets = presets.filter(
    preset => !preset.data.match(`[${Object.values(TokenType)}][0-9].`),
  );

  if (legacyPresets.length > 0) {
    return (
      <Box
        __backgroundColor={getStatusColor("warning")}
        paddingX={7}
        paddingY={5}
        marginBottom={5}
      >
        <Text>
          {formatMessage(messages.alertText, {
            presetNames: (
              <Text variant="bodyStrong">
                {legacyPresets.map(p => p.name).join(", ")}
              </Text>
            ),
          })}
        </Text>
      </Box>
    );
  }
  return null;
};

const messages = defineMessages({
  alertText: {
    defaultMessage:
      "You are using an old version of filter presets. The following presets: {presetNames} must be updated to continue using filters",
    description: "Alert text",
    id: "eIGXwJ",
  },
});
