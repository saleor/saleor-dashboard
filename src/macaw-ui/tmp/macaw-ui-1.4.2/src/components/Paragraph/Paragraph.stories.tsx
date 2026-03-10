import { Meta, StoryObj } from "@storybook/react";
import { Paragraph } from "./index";

const meta: Meta<typeof Paragraph> = {
  title: "Components / Paragraph",
  tags: ["autodocs"],
  component: Paragraph,
};

export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
  args: {
    size: 4,
    children: "Some text displayed as block.",
  },
};
