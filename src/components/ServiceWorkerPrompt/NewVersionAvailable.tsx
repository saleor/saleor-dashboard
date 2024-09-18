import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const NewVersionAvailable = ({ onUpdate }: { onUpdate: () => void }) => {
  return (
    <Box
      backgroundColor="warning1"
      paddingX={3}
      height={6}
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
        onClick={onUpdate}
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
