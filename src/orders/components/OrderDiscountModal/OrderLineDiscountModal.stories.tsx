import { DiscountValueTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderLineDiscountModal } from "./OrderLineDiscountModal";
import { type OrderDiscountCommonInput } from "./types";

const defaultMaxPrice = {
  __typename: "Money" as const,
  currency: "USD",
  amount: 89.99,
};

const lineData = {
  productName: "Saleor Branded T-Shirt",
  variantName: "Size M / Black",
  productSku: "SKU-TSHIRT-M-BLK",
  quantity: 3,
  thumbnail: {
    url: "https://placehold.co/96x96/e2e8f0/475569?text=T",
  },
};

const existingDiscount: OrderDiscountCommonInput = {
  value: 15,
  reason: "Bulk order discount",
  calculationMode: DiscountValueTypeEnum.PERCENTAGE,
};

const meta: Meta<typeof OrderLineDiscountModal> = {
  title: "Orders/OrderLineDiscountModal",
  component: OrderLineDiscountModal,
  args: {
    open: true,
    maxPrice: defaultMaxPrice,
    lineData,
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
type Story = StoryObj<typeof OrderLineDiscountModal>;

export const NewDiscount: Story = {};

export const WithExistingDiscount: Story = {
  args: {
    existingDiscount,
  },
};

export const WithFixedDiscount: Story = {
  args: {
    existingDiscount: {
      value: 25,
      reason: "Price match",
      calculationMode: DiscountValueTypeEnum.FIXED,
    },
  },
};

export const WithoutThumbnail: Story = {
  args: {
    lineData: {
      ...lineData,
      thumbnail: null,
    },
  },
};

export const WithoutSku: Story = {
  args: {
    lineData: {
      ...lineData,
      productSku: null,
    },
  },
};

export const WithoutVariantName: Story = {
  args: {
    lineData: {
      ...lineData,
      variantName: undefined,
    },
  },
};

export const LongProductName: Story = {
  args: {
    lineData: {
      ...lineData,
      productName:
        "Premium Organic Extra-Long Staple Egyptian Cotton Bath Towel Set — Luxury Collection",
      variantName: "King Size / Ivory White / Monogrammed",
    },
  },
};

export const WithoutLineData: Story = {
  args: {
    lineData: undefined,
  },
};

export const ConfirmLoading: Story = {
  args: {
    existingDiscount,
    confirmStatus: "loading",
  },
};
