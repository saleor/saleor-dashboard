import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";

export const OrderManualTransactionRefundWarning = () => {
  const theme = useTheme();

  // This is a workaround because of the lack of high-contrast
  // tokens in the dark theme which are going to look good visually
  // on yellow (warning) background
  const textColor = theme.theme === "defaultDark" ? "buttonDefaultPrimary" : "default1";

  return (
    <Box backgroundColor="warning1" padding={3} borderRadius={3}>
      <Text size={2} color={textColor}>
        <FormattedMessage {...messages.sidebardDescription} />
        <br />
        <ExternalLinkNext
          size={2}
          textDecoration="underline"
          color={textColor}
          href="https://docs.saleor.io/docs/next/developer/payments#manual-refund"
          target="__blank"
        >
          <FormattedMessage {...messages.seeDocs} />
        </ExternalLinkNext>
      </Text>
    </Box>
  );
};
