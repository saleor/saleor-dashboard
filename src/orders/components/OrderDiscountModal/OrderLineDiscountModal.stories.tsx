import { DiscountValueTypeEnum, OrderDiscountType } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { OrderLineDiscountModal } from "./OrderLineDiscountModal";
import { type OrderDiscountCommonInput } from "./types";

type Props = ComponentProps<typeof OrderLineDiscountModal>;

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

const findDialog = async () => {
  const body = within(document.body);
  const dialog = await body.findByRole("dialog");

  return within(dialog);
};

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

export const WithAutomaticPromotion: Story = {
  args: {
    automaticDiscounts: [
      {
        type: OrderDiscountType.PROMOTION,
        name: "Summer Sale 2024",
      },
    ],
  },
  play: async () => {
    const dialog = await findDialog();

    // The promotion name is rendered inside its own bolded <span> to stand
    // out within the callout, while the rest of the sentence stays default.
    const promotionName = await dialog.findByText(/Summer Sale 2024/);

    await expect(promotionName.tagName.toLowerCase()).toBe("span");
    await expect(dialog.getByText(/already discounted by/i)).toBeInTheDocument();
    await expect(
      dialog.getByText("A manual discount below will replace the existing one."),
    ).toBeInTheDocument();
  },
};

export const WithAutomaticVoucher: Story = {
  args: {
    automaticDiscounts: [
      {
        type: OrderDiscountType.VOUCHER,
        name: "WELCOME10",
      },
    ],
  },
  play: async () => {
    const dialog = await findDialog();
    const voucherName = await dialog.findByText(/WELCOME10/);

    await expect(voucherName.tagName.toLowerCase()).toBe("span");
    await expect(dialog.getByText(/voucher/i)).toBeInTheDocument();
  },
};

export const SubmitsLineDiscount: Story = {
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();

    await userEvent.type(dialog.getByTestId("discount-value"), "20");
    await userEvent.click(dialog.getByTestId("submit"));

    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(args.onConfirm).toHaveBeenCalledWith({
      calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      reason: "",
      value: 20,
    });
  },
};
