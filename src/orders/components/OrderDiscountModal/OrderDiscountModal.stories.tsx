import { DiscountValueTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { OrderDiscountModal } from "./OrderDiscountModal";
import { type OrderDiscountCommonInput } from "./types";

type Props = ComponentProps<typeof OrderDiscountModal>;

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

// DashboardModal renders in a Radix portal, so we find the dialog by role
// within document.body and query inside it.
const findDialog = async () => {
  const body = within(document.body);
  const dialog = await body.findByRole("dialog");

  return within(dialog);
};

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

export const SubmitsNewDiscount: Story = {
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();

    await userEvent.type(dialog.getByTestId("discount-value"), "15");
    await userEvent.type(dialog.getByTestId("discount-reason"), "Referral promotion");
    await userEvent.click(dialog.getByTestId("submit"));

    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(args.onConfirm).toHaveBeenCalledWith({
      calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      reason: "Referral promotion",
      value: 15,
    });
  },
};

export const ConvertsValueWhenSwitchingCalculationMode: Story = {
  args: {
    existingDiscount: existingPercentageDiscount,
  },
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();

    // Switching PERCENTAGE (10%) -> FIXED with maxPrice=250 should compute 25.
    await userEvent.click(dialog.getByRole("radio", { name: /fixed amount/i }));
    await userEvent.click(dialog.getByTestId("submit"));

    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(args.onConfirm).toHaveBeenCalledWith({
      calculationMode: DiscountValueTypeEnum.FIXED,
      reason: "Loyal customer",
      value: 25,
    });
  },
};

export const ShowsErrorWhenPercentageAbove100: Story = {
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();

    await userEvent.type(dialog.getByTestId("discount-value"), "150");

    await expect(await dialog.findByText("Cannot be higher than 100%")).toBeInTheDocument();
    await expect(dialog.getByTestId("submit")).toBeDisabled();

    // onConfirm must not be called while the form is invalid.
    await userEvent.click(dialog.getByTestId("submit"));
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const RemovesExistingDiscount: Story = {
  args: {
    existingDiscount: existingPercentageDiscount,
  },
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();

    await userEvent.click(dialog.getByTestId("button-remove"));

    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

export const CloseButtonIsAccessible: Story = {
  play: async ({ args }: { args: Props }) => {
    const dialog = await findDialog();
    const closeButton = dialog.getByTestId("close-button");

    // The icon-only button must expose a name to assistive technologies
    // and a native tooltip via `title`.
    await expect(closeButton).toHaveAttribute("aria-label", "Close");
    await expect(closeButton).toHaveAttribute("title", "Close");

    await userEvent.click(closeButton);
    await expect(args.onClose).toHaveBeenCalled();
  },
};
