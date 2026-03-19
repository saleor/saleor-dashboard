import { GiftCardErrorCode } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import GiftCardTagInput from "./GiftCardTagInput";

const meta: Meta<typeof GiftCardTagInput> = {
  title: "GiftCards/GiftCardTagInput",
  component: GiftCardTagInput,
  args: {
    name: "tags",
    onChange: fn(),
    values: [],
  },
};

export default meta;
type Story = StoryObj<typeof GiftCardTagInput>;

export const Default: Story = {};

export const WithValues: Story = {
  args: {
    values: [
      { label: "VIP", value: "vip" },
      { label: "Holiday", value: "holiday" },
    ],
  },
};

export const WithError: Story = {
  args: {
    error: { code: GiftCardErrorCode.INVALID, field: "tags" },
  },
};

export const Required: Story = {
  args: {
    optional: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
