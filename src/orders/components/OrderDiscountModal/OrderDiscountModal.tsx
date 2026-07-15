import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type MoneyFragment } from "@dashboard/graphql";
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
      title={
        <FormattedMessage
          defaultMessage="Order discount"
          id="oO2fji"
          description="dialog title for order discount"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="Discount this order by a percentage or fixed amount"
          id="ous0aA"
          description="dialog subtitle for order discount"
        />
      }
    />
  );
};
