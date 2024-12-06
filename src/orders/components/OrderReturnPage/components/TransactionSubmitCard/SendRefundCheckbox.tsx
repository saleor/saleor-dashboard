import RequirePermissions from "@dashboard/components/RequirePermissions";
import {
  PermissionEnum,
  TransactionRequestRefundForGrantedRefundErrorFragment,
} from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Checkbox, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { OrderReturnData } from "../../form";
import { CanSendRefund } from "../../utils";
import { submitCardMessages } from "./messages";

interface SendRefundCheckboxProps {
  canSendRefund: CanSendRefund;
  autoSendRefund: boolean;
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  onChange: FormChange;
}

export const SendRefundCheckbox = ({
  canSendRefund,
  autoSendRefund,
  sendRefundErrors,
  onChange,
}: SendRefundCheckboxProps) => (
  <RequirePermissions requiredPermissions={[PermissionEnum.HANDLE_PAYMENTS]}>
    {canSendRefund.value ? (
      <Checkbox
        data-test-id={"auto-send-refund-checkbox"}
        checked={autoSendRefund}
        error={sendRefundErrors.length > 0}
        name={"autoSendRefund" satisfies keyof OrderReturnData}
        onCheckedChange={checked => {
          onChange({
            target: {
              name: "autoSendRefund",
              value: checked,
            },
          });
        }}
      >
        <Text color={sendRefundErrors.length ? "critical1" : undefined}>
          <FormattedMessage {...submitCardMessages.autoSendRefund} />
        </Text>
      </Checkbox>
    ) : (
      <Tooltip>
        <Tooltip.Trigger>
          <Checkbox checked={false} disabled={true}>
            <Text color="defaultDisabled">
              <FormattedMessage {...submitCardMessages.autoSendRefund} />
            </Text>
          </Checkbox>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <FormattedMessage {...canSendRefund.reason} />
        </Tooltip.Content>
      </Tooltip>
    )}
  </RequirePermissions>
);
