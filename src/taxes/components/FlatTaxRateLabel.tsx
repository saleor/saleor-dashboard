import { Box, Text } from "@macaw-ui";
import { useIntl } from "react-intl";

export const FlatTaxRateLabel = () => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center">
      <Text>
        {intl.formatMessage({
          defaultMessage: "Use flat tax rate",
          id: "zSDfq0",
        })}
      </Text>
    </Box>
  );
};
