import { DiscountValueTypeEnum } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderDiscountCommonModal, {
  OrderDiscountCommonModalProps,
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
    currency: "PLN",
  },
  modalType: ORDER_DISCOUNT,
  onClose: emptyFunction,
  onConfirm: emptyFunction,
  onRemove: emptyFunction,
  removeStatus: "default",
};

storiesOf("Orders / Order Discount common modal", module)
  .addDecorator(Decorator)
  .add("percentage without existing discount", () => (
    <OrderDiscountCommonModal {...basicProps} />
  ))
  .add("percentage with existing discount", () => (
    <OrderDiscountCommonModal
      {...basicProps}
      existingDiscount={{
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
        reason: "Cause customers want it cheap",
        value: 25,
      }}
    />
  ))
  .add("fixed amount with existing discount", () => (
    <OrderDiscountCommonModal
      {...basicProps}
      existingDiscount={{
        calculationMode: DiscountValueTypeEnum.FIXED,
        reason: "Cause I say so",
        value: 5.5,
      }}
    />
  ))
  .add("fixed amount with loading confirm", () => (
    <OrderDiscountCommonModal
      {...basicProps}
      confirmStatus="loading"
      existingDiscount={{
        calculationMode: DiscountValueTypeEnum.FIXED,
        reason: "Cause I say so",
        value: 5.5,
      }}
    />
  ));
