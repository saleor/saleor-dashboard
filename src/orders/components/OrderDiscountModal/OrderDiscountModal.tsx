import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DiscountModalBase } from "./DiscountModalBase";
import { type OrderDiscountCommonInput } from "./types";

interface OrderDiscountModalProps {
  open: boolean;
  maxPrice: MoneyFragment;
  existingDiscount?: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const OrderDiscountModal = ({
  open,
  maxPrice,
  existingDiscount,
  confirmStatus,
  removeStatus,
  onConfirm,
  onRemove,
  onClose,
}: OrderDiscountModalProps) => {
  const header = (
    <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
      <Text size={5} fontWeight="bold">
        <FormattedMessage
          defaultMessage="Order discount"
          id="oO2fji"
          description="dialog title for order discount"
        />
      </Text>
      <Text size={2} color="default2">
        <FormattedMessage
          defaultMessage="Discount this order by a percentage or fixed amount"
          id="ous0aA"
          description="dialog subtitle for order discount"
        />
      </Text>
    </Box>
  );

  return (
    <DiscountModalBase
      open={open}
      maxPrice={maxPrice}
      existingDiscount={existingDiscount}
      confirmStatus={confirmStatus}
      removeStatus={removeStatus}
      onConfirm={onConfirm}
      onRemove={onRemove}
      onClose={onClose}
      header={header}
    />
  );
};
