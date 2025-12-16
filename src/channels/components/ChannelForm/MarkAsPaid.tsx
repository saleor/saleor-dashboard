import Link from "@dashboard/components/Link";
import { PAYMENT_APPS_DOCS_URL, PAYMENT_PLUGINS_DOCS_URL } from "@dashboard/links";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface MarkAsPaidProps {
  hasError: boolean;
  isChecked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
}

export const MarkAsPaid = ({ hasError, isChecked, onCheckedChange, disabled }: MarkAsPaidProps) => (
  <Box paddingX={6} marginTop={4}>
    <Checkbox
      data-test-id="order-settings-mark-as-paid"
      error={hasError}
      checked={isChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      name="markAsPaidStrategy"
    >
      <Text>
        <FormattedMessage {...messages.markAsPaid} />
      </Text>
    </Checkbox>
    <Box display="flex" flexDirection="column" paddingLeft={4}>
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage
          defaultMessage='"Mark as paid" feature creates a {link} - used by Payment Apps'
          id="Qb2XN5"
          values={{
            link: (
              <Link href={PAYMENT_APPS_DOCS_URL} target="_blank" rel="noopener noreferrer">
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
              <Link href={PAYMENT_PLUGINS_DOCS_URL} target="_blank" rel="noopener noreferrer">
                <FormattedMessage defaultMessage="Payment" id="NmK6zy" />
              </Link>
            ),
          }}
        />
      </Text>
    </Box>
  </Box>
);
