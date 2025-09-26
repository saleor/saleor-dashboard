import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const PluginLabel = () => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center">
      <Text>
        {intl.formatMessage({
          defaultMessage: "Use Avalara plugin",
          id: "hyAOPB",
        })}
      </Text>
    </Box>
  );
};
