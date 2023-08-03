import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import {
  Box,
  Checkbox,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage,  } from "react-intl";

import { messages } from "./messages";

interface MarkAsPaidProps {
  isDiabled: boolean
  isChecked: boolean
  onCheckedChange: () => void;
}

export const MarkAsPaid = ({ isDiabled, isChecked, onCheckedChange }: MarkAsPaidProps) => (
  <Box paddingX={6} marginTop={4}>
    <Checkbox
      data-test-id="order-settings-mark-as-paid"
      disabled={isDiabled}
      checked={isChecked}
      onCheckedChange={onCheckedChange}
      name="markAsPaidStrategy"
    >
      <Text>
        <FormattedMessage {...messages.markAsPaid} />
      </Text>
      <PreviewPill />
    </Checkbox>
    <Box display="flex" flexDirection="column" paddingLeft={4}>
      <Text
        variant="caption"
        color="textNeutralSubdued"
        size="large"
        paddingLeft={0.5}
      >
        <FormattedMessage
          defaultMessage='"Mark as paid" feature creates a'
          id="MDOw8D"
        />{" "}
        <Link
          href="https://docs.saleor.io/docs/3.x/developer/payments#processing-a-payment-with-payment-app"
          target="_blank"
          rel="noopener noreferer"
        >
          <FormattedMessage defaultMessage="Transaction" id="1+ROfp" />
        </Link>{" "}
        <FormattedMessage
          defaultMessage="- used by Payment Apps"
          id="Fqe4aB"
        />
      </Text>
      <Text
        variant="caption"
        color="textNeutralSubdued"
        size="large"
        paddingLeft={0.5}
      >
        <FormattedMessage
          defaultMessage="If left unchecked it creates a"
          id="hHv0ih"
        />{" "}
        <Link
          href="https://docs.saleor.io/docs/3.x/developer/payments#payment-plugin"
          target="_blank"
          rel="noopener noreferer"
        >
          <FormattedMessage defaultMessage="Payment" id="NmK6zy" />
        </Link>{" "}
        <FormattedMessage
          defaultMessage="- used by Payment Plugins"
          id="50lR2F"
        />
      </Text>
    </Box>
  </Box>
)