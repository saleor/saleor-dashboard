import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useRegisterSW } from "virtual:pwa-register/react";

export const NewVersionBar = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) {
    return null;
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
          id="sngdVO"
          defaultMessage="New dashboard version available."
          description="New dashboard version available."
        />
      </Text>
      <Button
        onClick={() => updateServiceWorker(true)}
        size="small"
        variant="tertiary"
        color="accent1"
        textDecoration="underline"
        __paddingRight="3px"
        __paddingLeft="3px"
      >
        <FormattedMessage
          id="t1Qs2z"
          defaultMessage="Click here to reload."
          description="Click here to reload."
        />
      </Button>
    </Box>
  );
};
