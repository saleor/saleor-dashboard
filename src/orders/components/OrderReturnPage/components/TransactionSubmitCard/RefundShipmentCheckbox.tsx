import { FormChange } from "@dashboard/hooks/useForm";
import { IMoney } from "@dashboard/utils/intl";
import { Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { submitCardMessages } from "./messages";

interface RefundShipmentCheckboxProps {
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  autoGrantRefund: boolean;
  shipmentCost: IMoney;
  onChange: FormChange;
}

const RefundShipmentCheckbox: React.FC<RefundShipmentCheckboxProps> = ({
  refundShipmentCosts,
  canRefundShipping,
  autoGrantRefund,
  shipmentCost,
  onChange,
}) => {
  const handleRefundShipmentCosts = React.useCallback(
    checked => {
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
