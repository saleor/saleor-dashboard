import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AlertExclamationIcon } from "./AlertExclamationIcon";

const meta: Meta<typeof AlertExclamationIcon> = {
  title: "Extensions/AppAlerts/AlertExclamationIcon",
  component: AlertExclamationIcon,
};

export default meta;
type Story = StoryObj<typeof AlertExclamationIcon>;

export const Default: Story = {};

export const Large: Story = {
  args: { width: 32, height: 32 },
};

export const SideBySide: Story = {
  render: () => (
    <Box display="flex" alignItems="center" gap={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <AlertExclamationIcon />
        <Text size={2}>Default (hover for filled variant)</Text>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <AlertExclamationIcon width={24} height={24} />
        <Text size={2}>24px</Text>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <AlertExclamationIcon width={32} height={32} />
        <Text size={2}>32px</Text>
      </Box>
    </Box>
  ),
};
