import { PromotionTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { DiscountTypeChangeDialog } from "./DiscountTypeChangeDialog";

const meta: Meta<typeof DiscountTypeChangeDialog> = {
  title: "Discounts/DiscountTypeChangeDialog",
  component: DiscountTypeChangeDialog,
  args: {
    open: true,
    currentType: PromotionTypeEnum.CATALOGUE,
    ruleCount: 2,
    onConfirm: fn(),
    onClose: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof DiscountTypeChangeDialog>;

export const SeveralCatalogRules: Story = {};

export const OneOrderRule: Story = {
  args: { currentType: PromotionTypeEnum.ORDER, ruleCount: 1 },
};
