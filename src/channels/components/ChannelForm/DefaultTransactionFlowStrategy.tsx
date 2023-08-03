
import PreviewPill from "@dashboard/components/PreviewPill";
import { FormChange, } from "@dashboard/hooks/useForm";
import {
  Box,
  Checkbox,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AllowUnpaidOrdersProps {
  onChange: FormChange
  isChecked: boolean
  hasError: boolean
}

export const DefaultTransactionFlowStrategy = ({ onChange, isChecked, hasError }: AllowUnpaidOrdersProps) => (
  <Box paddingX={6}>
    <Checkbox
      name="defaultTransactionFlowStrategy"
      data-test-id="default-transaction-strategy-checkbox"
      checked={isChecked}
      error={hasError}
      onCheckedChange={value =>
        onChange({ target: { name: "defaultTransactionFlowStrategy", value } })
      }
    >
      <Text>
        <FormattedMessage {...messages.defaultTransactionFlowStrategyLabel} />
      </Text>{" "}
      <PreviewPill />
    </Checkbox>
    <Box paddingLeft={4}>
      {" "}
      <Text
        variant="caption"
        color="textNeutralSubdued"
        size="large"
        paddingLeft={0.5}
      >
        <FormattedMessage {...messages.defaultTransactionFlowStrategyDescription} />
      </Text>
    </Box>
  </Box>
)