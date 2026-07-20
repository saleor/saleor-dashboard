import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { StoreDetailsCard } from "./StoreDetailsCard";

const meta: Meta<typeof StoreDetailsCard> = {
  title: "Site Settings / StoreDetailsCard",
  component: StoreDetailsCard,
  args: {
    errors: [],
    disabled: false,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof StoreDetailsCard>;

export const Default: Story = {
  args: {
    data: {
      name: "Saleor e-commerce",
      description: "The best place to shop online.",
    },
  },
};

export const Empty: Story = {
  args: {
    data: {
      name: "",
      description: "",
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    data: {
      name: "Saleor e-commerce",
      description: "The best place to shop online.",
    },
  },
};
