import { Meta, StoryObj } from "@storybook/react";
import { DropdownButton } from "./index";

const meta: Meta<typeof DropdownButton> = {
  title: "Components / DropdownButton",
  tags: ["autodocs"],
  component: DropdownButton,
};

export default meta;
type Story = StoryObj<typeof DropdownButton>;

export const Primary: Story = {
  name: "Contained",
  args: {
    variant: "contained",
    children: "Filters",
  },
};

export const AsText: Story = {
  name: "Text variant",
  args: {
    variant: "text",
    children: "Filters",
  },
};
