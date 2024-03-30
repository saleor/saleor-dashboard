import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export const PluginLabel: React.FC = () => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" __height="40px">
      <Text>
        {intl.formatMessage({
          defaultMessage: "Use Avalara plugin",
          id: "hyAOPB",
        })}
      </Text>
    </Box>
  );
};
