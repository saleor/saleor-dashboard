import { DiscountValueTypeEnum } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import OrderDiscountCommonModal, {
  OrderDiscountCommonModalProps
} from "./OrderDiscountCommonModal";
import { ORDER_DISCOUNT } from "./types";

/* eslint-disable-next-line */
const emptyFunction = () => {};

const basicProps: OrderDiscountCommonModalProps = {
  anchorRef: React.createRef(),
  confirmStatus: "default",
  dialogPlacement: "top-start",
  existingDiscount: null,
  isOpen: true,
  maxPrice: {
    __typename: "Money",
    amount: 15,
    currency: "PLN"
  },
  modalType: ORDER_DISCOUNT,
  onClose: emptyFunction,
  onConfirm: emptyFunction,
  onRemove: emptyFunction,
  removeStatus: "default"
};

export default {
  title: "Orders / Order Discount common modal",
  decorators: [Decorator]
};

export const PercentageWithoutExistingDiscount = () => (
  <OrderDiscountCommonModal {...basicProps} />
);

PercentageWithoutExistingDiscount.story = {
  name: "percentage without existing discount"
};

export const PercentageWithExistingDiscount = () => (
  <OrderDiscountCommonModal
    {...basicProps}
    existingDiscount={{
      calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      reason: "Cause customers want it cheap",
      value: 25
    }}
  />
);

PercentageWithExistingDiscount.story = {
  name: "percentage with existing discount"
};

export const FixedAmountWithExistingDiscount = () => (
  <OrderDiscountCommonModal
    {...basicProps}
    existingDiscount={{
      calculationMode: DiscountValueTypeEnum.FIXED,
      reason: "Cause I say so",
      value: 5.5
    }}
  />
);

FixedAmountWithExistingDiscount.story = {
  name: "fixed amount with existing discount"
};

export const FixedAmountWithLoadingConfirm = () => (
  <OrderDiscountCommonModal
    {...basicProps}
    confirmStatus="loading"
    existingDiscount={{
      calculationMode: DiscountValueTypeEnum.FIXED,
      reason: "Cause I say so",
      value: 5.5
    }}
  />
);

FixedAmountWithLoadingConfirm.story = {
  name: "fixed amount with loading confirm"
};
