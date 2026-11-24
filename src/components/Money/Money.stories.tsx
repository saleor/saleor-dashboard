import { Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import Money from "./Money";

const meta: Meta<typeof Money> = {
  title: "Components/Money",
  component: Money,
  args: {
    money: { amount: 1185.56, currency: "PLN" },
  },
};

export default meta;
type Story = StoryObj<typeof Money>;

export const Default: Story = {};

export const InsideText: Story = {
  render: (args: ComponentProps<typeof Money>) => (
    <Text size={5}>
      Total: <Money {...args} />
    </Text>
  ),
};

export const ZeroDecimalCurrency: Story = {
  args: {
    money: { amount: 120000, currency: "JPY" },
  },
};

export const Empty: Story = {
  args: {
    money: null,
  },
};
