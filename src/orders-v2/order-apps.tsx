import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const OrderApps = () => {
  const intl = useIntl();

  return (
    <Box padding={6} gap={4} display="grid">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={5} fontWeight="medium">
          {intl.formatMessage({
            id: "gRiKLf",
            defaultMessage: "Apps",
          })}
        </Text>
        {/* TODO: render here apps widgets component without old headers */}
      </Box>
    </Box>
  );
};
