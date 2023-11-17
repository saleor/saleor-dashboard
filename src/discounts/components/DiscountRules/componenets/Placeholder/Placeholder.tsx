import { Box, PlusIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

export const Placeholder = () => {
  const intl = useIntl();

  return (
    <Box
      paddingX={4}
      paddingY={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      borderRadius={4}
      borderColor="neutralPlain"
      borderWidth={1}
      borderStyle="solid"
    >
      <PlusIcon size="large" color="iconNeutralSubdued" />
      <Text size="large">{intl.formatMessage(messages.placeholder)}</Text>
    </Box>
  );
};
