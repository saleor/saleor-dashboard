import { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components / SearchInput",
  tags: ["autodocs"],
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Primary: Story = {
  args: {
    size: "large",
    placeholder: "Search for products",
  },
};
