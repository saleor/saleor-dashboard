import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import HorizontalSpacer from "./HorizontalSpacer";

const meta: Meta<typeof HorizontalSpacer> = {
  title: "Components/HorizontalSpacer",
  component: HorizontalSpacer,
  args: {
    spacing: 4,
  },
  render: (args: ComponentProps<typeof HorizontalSpacer>) => (
    <Box padding={4} display="flex" alignItems="center">
      <Text>Left</Text>
      <Box backgroundColor="default2" __height="20px" display="flex">
        <HorizontalSpacer {...args} />
      </Box>
      <Text>Right</Text>
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof HorizontalSpacer>;

export const Default: Story = {};

export const SingleUnit: Story = {
  args: {
    spacing: 1,
  },
};
