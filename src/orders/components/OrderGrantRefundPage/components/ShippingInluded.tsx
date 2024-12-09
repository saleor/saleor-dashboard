import { formatMoneyAmount } from "@dashboard/components/Money";
import useLocale from "@dashboard/hooks/useLocale";
import { IMoney } from "@dashboard/utils/intl";
import { useId } from "@reach/auto-id";
import { Box, Skeleton, Text, Toggle } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { useGrantRefundContext } from "../context";
import { grantRefundPageMessages } from "../messages";

interface ShippingIncludedProps {
  currency: string;
  amount: IMoney;
  canRefundShipping: boolean;
}

export const ShippingIncluded = ({
  currency,
  amount,
  canRefundShipping,
}: ShippingIncludedProps) => {
  const id = useId();
  const { locale } = useLocale();
  const { state, dispatch } = useGrantRefundContext();

  return (
    <Box>
      <Toggle
        id={`checkbox-${id}`}
        pressed={state.refundShipping}
        onPressedChange={() => dispatch({ type: "toggleRefundShipping" })}
        data-test-id="refundShippingCheckbox"
        disabled={!currency || !canRefundShipping}
      >
        {!currency ? (
          <Skeleton />
        ) : (
          <FormattedMessage
            {...grantRefundPageMessages.refundShipment}
            values={{
              currency,
              amount: formatMoneyAmount(amount, locale),
            }}
          />
        )}
      </Toggle>

      {!canRefundShipping && (
        <Text size={2} color="defaultDisabled">
          <FormattedMessage defaultMessage="Shipping has already been refunded" id="o/4OCR" />
        </Text>
      )}
    </Box>
  );
};
