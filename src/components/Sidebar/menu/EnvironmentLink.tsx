import { ArrowLeftIcon, Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const UTM_PARAMS = "?utm_source=dashboard&utm_content=sidebar_button";

const stagingLink = (hostname: string) =>
  `https://staging-cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

const prodLink = (hostname: string) =>
  `https://cloud.saleor.io/env/${hostname}${UTM_PARAMS}`;

const generateEnvLink = () => {
  const { hostname } = window.location;

  if (hostname.includes(".staging.")) {
    return stagingLink(hostname);
  }

  return prodLink(hostname);
};

export const EnvironmentLink = () => {
  return (
    <Box
      as="a"
      href={generateEnvLink()}
      target="__blank"
      gap={3}
      display="flex"
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
