import { FormChange } from "@dashboard/hooks/useForm";
import { IMoney } from "@dashboard/utils/intl";
import { Checkbox, Text } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { submitCardMessages } from "./messages";

interface RefundShipmentCheckboxProps {
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  autoGrantRefund: boolean;
  shipmentCost: IMoney | undefined;
  onChange: FormChange;
}

const RefundShipmentCheckbox = ({
  refundShipmentCosts,
  canRefundShipping,
  autoGrantRefund,
  shipmentCost,
  onChange,
}: RefundShipmentCheckboxProps) => {
  const handleRefundShipmentCosts = useCallback(
    (checked: string | boolean) => {
      onChange({
        target: {
          name: "refundShipmentCosts",
          value: checked,
        },
      });
    },
    [onChange],
  );
  const isDisabled = !canRefundShipping || !autoGrantRefund;

  return (
    <Checkbox
      data-test-id="refund-shipment-costs-checkbox"
      marginTop={4}
      checked={refundShipmentCosts}
      name={"refundShipmentCosts"}
      onCheckedChange={handleRefundShipmentCosts}
      disabled={isDisabled}
    >
      <Text color={isDisabled ? "defaultDisabled" : undefined}>
        <FormattedMessage
          {...submitCardMessages.refundShipment}
          values={{
            currency: shipmentCost?.currency,
            amount: shipmentCost?.amount,
          }}
        />
      </Text>
    </Checkbox>
  );
};

export default RefundShipmentCheckbox;
