import { ArrowLeftIcon, Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useEnvLink } from "./hooks/useEnvLink";

export const EnvironmentLink = () => {
  const envLink = useEnvLink();

  return (
    <Box
      as="a"
      href={envLink}
      target="__blank"
      gap={3}
      display="flex"
      data-test-id="menu-item-label-env"
      alignItems="center"
    >
      <ArrowLeftIcon color="default2" size="medium" />
      <Text
        size="small"
        variant="bodyEmp"
        fontStyle="italic"
        color="default2"
        fontSize="captionSmall"
      >
        <FormattedMessage defaultMessage="Go to Saleor Cloud" id="EXqb2l" />
      </Text>
    </Box>
  );
};
