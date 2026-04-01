import { DiscountValueTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderDiscountModal } from "./OrderDiscountModal";
import { type OrderDiscountCommonInput } from "./types";

const defaultMaxPrice = {
  __typename: "Money" as const,
  currency: "USD",
  amount: 250,
};

const existingPercentageDiscount: OrderDiscountCommonInput = {
  value: 10,
  reason: "Loyal customer",
  calculationMode: DiscountValueTypeEnum.PERCENTAGE,
};

const existingFixedDiscount: OrderDiscountCommonInput = {
  value: 35.5,
  reason: "Damaged packaging",
  calculationMode: DiscountValueTypeEnum.FIXED,
};

const meta: Meta<typeof OrderDiscountModal> = {
  title: "Orders/OrderDiscountModal",
  component: OrderDiscountModal,
  args: {
    open: true,
    maxPrice: defaultMaxPrice,
    confirmStatus: "default",
    removeStatus: "default",
    onConfirm: fn(),
    onRemove: fn(),
    onClose: fn(),
  },
  argTypes: {
    confirmStatus: {
      control: "select",
      options: ["default", "loading", "success", "error"],
    },
    removeStatus: {
      control: "select",
      options: ["default", "loading", "success", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrderDiscountModal>;

export const NewDiscount: Story = {};

export const EditPercentageDiscount: Story = {
  args: {
    existingDiscount: existingPercentageDiscount,
  },
};

export const EditFixedDiscount: Story = {
  args: {
    existingDiscount: existingFixedDiscount,
  },
};

export const ConfirmLoading: Story = {
  args: {
    existingDiscount: existingPercentageDiscount,
    confirmStatus: "loading",
  },
};

export const RemoveLoading: Story = {
  args: {
    existingDiscount: existingPercentageDiscount,
    removeStatus: "loading",
  },
};
