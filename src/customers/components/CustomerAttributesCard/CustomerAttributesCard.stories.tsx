import type { Meta, StoryObj } from "@storybook/react-vite";

import { CustomerAttributesCard } from "./CustomerAttributesCard";

const meta: Meta<typeof CustomerAttributesCard> = {
  title: "Customers / CustomerAttributesCard",
  component: CustomerAttributesCard,
};

export default meta;

type Story = StoryObj<typeof CustomerAttributesCard>;

export const Default: Story = {
  args: {
    disabled: false,
    savedTypeId: "type-1",
    selectedType: { id: "type-1", name: "Default" },
    onChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    savedTypeId: "type-1",
    selectedType: { id: "type-1", name: "Default" },
    onChange: () => undefined,
  },
};

export const PendingTypeChange: Story = {
  args: {
    disabled: false,
    savedTypeId: "type-1",
    selectedType: { id: "type-2", name: "Wholesale" },
    onChange: () => undefined,
  },
};
