import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import VerticalSpacer from "./VerticalSpacer";

const meta: Meta<typeof VerticalSpacer> = {
  title: "Components/VerticalSpacer",
  component: VerticalSpacer,
  args: {
    spacing: 3,
  },
  render: (args: ComponentProps<typeof VerticalSpacer>) => (
    <Box padding={4}>
      <Text display="block">Above</Text>
      <Box backgroundColor="default2">
        <VerticalSpacer {...args} />
      </Box>
      <Text display="block">Below</Text>
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof VerticalSpacer>;

export const Default: Story = {};

export const SingleUnit: Story = {
  args: {
    spacing: 1,
  },
};
