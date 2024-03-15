import Link from "@dashboard/components/Link";
import PreviewPill from "@dashboard/components/PreviewPill";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface MarkAsPaidProps {
  isDiabled: boolean;
  isChecked: boolean;
  onCheckedChange: () => void;
}

export const MarkAsPaid = ({
  isDiabled,
  isChecked,
  onCheckedChange,
}: MarkAsPaidProps) => (
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
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage
          defaultMessage='"Mark as paid" feature creates a {link} - used by Payment Apps'
          id="Qb2XN5"
          values={{
            link: (
              <Link
                href="https://docs.saleor.io/docs/3.x/developer/payments#processing-a-payment-with-payment-app"
                target="_blank"
                rel="noopener noreferer"
              >
                <FormattedMessage defaultMessage="Transaction" id="1+ROfp" />
              </Link>
            ),
          }}
        />
      </Text>
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage
          defaultMessage="If left unchecked it creates a {link} - used by Payment Plugins"
          id="eR2vV/"
          values={{
            link: (
              <Link
                href="https://docs.saleor.io/docs/3.x/developer/payments#payment-plugin"
                target="_blank"
                rel="noopener noreferer"
              >
                <FormattedMessage defaultMessage="Payment" id="NmK6zy" />
              </Link>
            ),
          }}
        />
      </Text>
    </Box>
  </Box>
);
