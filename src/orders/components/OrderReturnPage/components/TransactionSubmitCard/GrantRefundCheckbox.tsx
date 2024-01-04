import { OrderGrantRefundCreateErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderReturnData } from "../../form";
import { submitCardMessages } from "./messages";

interface GrantRefundCheckboxProps {
  autoGrantRefund: boolean;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  onChange: FormChange;
}

export const GrantRefundCheckbox = ({
  autoGrantRefund,
  grantRefundErrors,
  onChange,
}: GrantRefundCheckboxProps) => {
  return (
    <Checkbox
      data-test-id="auto-grant-refund-checkbox"
      checked={autoGrantRefund}
      error={grantRefundErrors.length > 0}
      name={"autoGrantRefund" satisfies keyof OrderReturnData}
      onCheckedChange={checked => {
        onChange({
          target: {
            name: "autoGrantRefund",
            value: checked,
          },
        });
      }}
    >
      <Text color={grantRefundErrors.length ? "critical1" : undefined}>
        <FormattedMessage {...submitCardMessages.autoGrantRefund} />
      </Text>
    </Checkbox>
  );
};
