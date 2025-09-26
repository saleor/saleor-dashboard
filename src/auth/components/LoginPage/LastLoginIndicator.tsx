import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const LastLoginIndicator = () => {
  const { formatMessage } = useIntl();

  return (
    <Box
      position="absolute"
      __inset="-9px -6px auto auto"
      backgroundColor="info1"
      paddingX={2}
      borderRadius={4}
    >
      <Text size={1}>
        {formatMessage({
          id: "AR/VVX",
          defaultMessage: "Last used",
          description: "Indicates last login method user used",
        })}
      </Text>
    </Box>
  );
};
