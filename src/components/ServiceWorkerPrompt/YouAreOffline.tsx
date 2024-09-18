import { WifiOff } from "@dashboard/icons/WifiOff";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const YouAreOffline = () => {
  return (
    <Box
      backgroundColor="info1"
      paddingX={3}
      height={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <WifiOff width={3.5} />
      <Text marginLeft={2} size={1} fontWeight="medium">
        <FormattedMessage
          id="cLnkZn"
          defaultMessage="You are currently offline. Some features may not be available."
          description="You are currently offline. Some features may not be available."
        />
      </Text>
    </Box>
  );
};
