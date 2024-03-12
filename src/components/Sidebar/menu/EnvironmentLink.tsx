import { Cloud } from "@dashboard/icons/Cloud";
import { Box, Text } from "@saleor/macaw-ui-next";
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
      color="default2"
      gap={3}
      display="flex"
      data-test-id="menu-item-label-env"
      alignItems="center"
    >
      <Box __width={20} __height={20}>
        <Cloud />
      </Box>
      <Text
        size="small"
        variant="bodyEmp"
        fontStyle="italic"
        fontSize="captionSmall"
      >
        <FormattedMessage defaultMessage="Saleor Cloud" id="IF2KbT" />
      </Text>
    </Box>
  );
};
