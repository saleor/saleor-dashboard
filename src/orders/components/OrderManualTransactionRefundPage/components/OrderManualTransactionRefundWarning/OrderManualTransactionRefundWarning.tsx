import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";

export const OrderManualTransactionRefundWarning = () => {
  return (
    <Box backgroundColor="warning1" padding={3} borderRadius={2} marginBottom={6}>
      <Text size={2}>
        <FormattedMessage {...messages.sidebardDescription} />{" "}
        <ExternalLinkNext
          size={2}
          color="accent1"
          href="https://docs.saleor.io/docs/next/developer/payments#manual-refund"
          target="__blank"
        >
          <FormattedMessage {...messages.seeDocs} />
        </ExternalLinkNext>
      </Text>
    </Box>
  );
};
