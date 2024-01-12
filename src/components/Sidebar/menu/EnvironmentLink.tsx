import { ArrowLeftIcon, Box, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const UTM_PARAMS = "?utm_source=dashboard&utm_content=sidebar_button";

const devLink = (hostname: string) =>
  `https://dev-cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

const stagingLink = (hostname: string) =>
  `https://staging-cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

const prodLink = (hostname: string) =>
  `https://cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

const generateEnvLink = () => {
  const { hostname } = window.location;

  if (hostname.includes(".staging.")) {
    return stagingLink(hostname);
  }

  if (hostname.includes(".dev.")) {
    return devLink(hostname);
  }

  return prodLink(hostname);
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
        <ArrowLeftIcon color="default2" size="medium" />
        <Text size="small" variant="bodyEmp">
          <FormattedMessage defaultMessage="Go to Saleor Cloud" id="EXqb2l" />
        </Text>
      </Box>
    </List.Item>
  );
};
