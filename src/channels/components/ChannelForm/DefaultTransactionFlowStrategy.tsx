import Link from "@dashboard/components/Link";
import { FormChange } from "@dashboard/hooks/useForm";
import { TRANSACTION_FLOW_STRATEGY_DOCS_URL } from "@dashboard/links";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AllowUnpaidOrdersProps {
  onChange: FormChange;
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
}

export const DefaultTransactionFlowStrategy = ({
  onChange,
  isChecked,
  hasError,
  disabled,
}: AllowUnpaidOrdersProps) => (
  <Box paddingX={6}>
    <Checkbox
      name="defaultTransactionFlowStrategy"
      data-test-id="default-transaction-strategy-checkbox"
      checked={isChecked}
      error={hasError}
      onCheckedChange={value =>
        onChange({ target: { name: "defaultTransactionFlowStrategy", value } })
      }
      disabled={disabled}
    >
      <Text>
        <FormattedMessage {...messages.defaultTransactionFlowStrategyLabel} />
      </Text>{" "}
    </Checkbox>
    <Box paddingLeft={4}>
      {" "}
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage
          {...messages.defaultTransactionFlowStrategyDescription}
          values={{
            link: (
              <Link
                href={TRANSACTION_FLOW_STRATEGY_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage defaultMessage="Learn more" id="TdTXXf" />
              </Link>
            ),
          }}
        />
      </Text>
    </Box>
  </Box>
);
