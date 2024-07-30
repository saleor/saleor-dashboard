import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const NewVersionBar = () => {
  const handleReloadClick = () => {
    console.log("Reload")
  }

  return (
    <Box
      backgroundColor="warning1"
      paddingX={3}
      paddingY={0.5}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Text size={1} fontWeight="medium">
        <FormattedMessage
          id="qXh9AY"
          defaultMessage="New dashboard version available."
          description="New dashboard version available."
        />
      </Text>
      <Button
        onClick={handleReloadClick}
        size="small"
        variant="tertiary"
        color="accent1"
        textDecoration="underline"
        __paddingRight="3px"
        __paddingLeft="3px"
      >
        <FormattedMessage
          id="3RBwU7"
          defaultMessage="Click here to reload."
          description="Click here to reload."
        />
      </Button>
    </Box>
  );
};
