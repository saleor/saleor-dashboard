import { Box, Text } from "@macaw-ui";
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
