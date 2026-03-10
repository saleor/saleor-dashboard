import { Meta, StoryObj } from "@storybook/react";
import { Text } from "./index";

const meta: Meta<typeof Text> = {
  title: "Components / Text",
  tags: ["autodocs"],
  component: Text,
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    size: 4,
    children: "Some text",
  },
};
