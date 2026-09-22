import { ProductTypeKindEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ProductTypeKindTiles } from "./ProductTypeKindTiles";

const meta: Meta<typeof ProductTypeKindTiles> = {
  title: "Product types / ProductTypeKindTiles",
  component: ProductTypeKindTiles,
};

export default meta;

type Story = StoryObj<typeof ProductTypeKindTiles>;

export const Regular: Story = {
  args: {
    value: ProductTypeKindEnum.NORMAL,
    onChange: fn(),
  },
};

export const GiftCard: Story = {
  args: {
    value: ProductTypeKindEnum.GIFT_CARD,
    onChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    value: ProductTypeKindEnum.NORMAL,
    disabled: true,
    onChange: fn(),
  },
};
