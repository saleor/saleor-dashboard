import Link from "@dashboard/components/Link";
import { exploreExtensionsPath } from "@dashboard/extensions/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";

export const NoExtensions = () => (
  <Box
    display="flex"
    justifyContent="center"
    flexDirection="column"
    gap={2}
    marginY={24}
    textAlign="center"
  >
    <Text size={5} fontWeight="bold" color="default1">
      <FormattedMessage {...messages.noExtensionsFound} />
    </Text>
    <Link href={exploreExtensionsPath}>
      <Text
        size={3}
        color="default1"
        textDecoration="underline"
        style={{ textUnderlineOffset: "4px" }}
      >
        <FormattedMessage {...messages.clearSearch} />
      </Text>
    </Link>
  </Box>
);
