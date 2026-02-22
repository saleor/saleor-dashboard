import Link from "@dashboard/components/Link";
import { OrderGrantRefundCreateErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { orderTransactionRefundUrl } from "@dashboard/orders/urls";
import { Box, Checkbox, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { OrderReturnData } from "../../form";
import { CanGrantRefund } from "../../utils";
import { submitCardMessages } from "./messages";

interface GrantRefundCheckboxProps {
  autoGrantRefund: boolean;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  onChange: FormChange;
  canGrantRefund: CanGrantRefund;
  orderId: string;
}

export const GrantRefundCheckbox = ({
  autoGrantRefund,
  grantRefundErrors,
  onChange,
  canGrantRefund,
  orderId,
}: GrantRefundCheckboxProps) => {
  if (!canGrantRefund.value) {
    return (
      <Box>
        <Tooltip>
          <Tooltip.Trigger>
            <Checkbox data-test-id="auto-grant-refund-checkbox" checked={false} disabled={true}>
              <Text color="defaultDisabled">
                <FormattedMessage {...submitCardMessages.autoGrantRefund} />
              </Text>
            </Checkbox>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            <FormattedMessage {...canGrantRefund.reason} />
          </Tooltip.Content>
        </Tooltip>
        <Box marginTop={1} paddingLeft={6}>
          <Link href={orderTransactionRefundUrl(orderId)}>
            <Text color="inherit" size={2}>
              <FormattedMessage {...submitCardMessages.grantRefundOnDedicatedPage} />
            </Text>
          </Link>
        </Box>
      </Box>
    );
  }

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
