import { Box, EnvironmentIcon, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const generateEnvLink = () => {
  const { hostname } = window.location;

  if (hostname.includes(".staging.")) {
    return `https://staging-cloud.saleor.io/env/${hostname}`;
  }

  return `https://cloud.saleor.io/env/${hostname}`;
};

export const EnvironmentLink = () => {
  return (
    <List.Item
      borderRadius={3}
      paddingX={2}
      marginBottom={5}
      data-test-id="menu-item-label-env"
      as="a"
      href={generateEnvLink()}
      target="__blank"
    >
      <Box paddingY={1.5} gap={3} display="flex" alignItems="center">
        <EnvironmentIcon color="default2" size="medium" />
        <Text size="small" variant="bodyEmp">
          <FormattedMessage defaultMessage="Open environment" id="xgpgVX" />
        </Text>
      </Box>
    </List.Item>
  );
};
