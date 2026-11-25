import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthWell } from "./AuthWell/AuthWell";
import { AuthShell } from "./Layout";

const meta: Meta<typeof AuthShell> = {
  title: "Auth / AuthShell",
  component: AuthShell,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isCloudInstance: true,
    children: (
      <AuthWell>
        <Box display="flex" flexDirection="column" gap={2}>
          <Text as="h1" size={6} fontWeight="bold">
            Welcome back
          </Text>
          <Text size={3} color="default2">
            Log in to your Saleor Dashboard.
          </Text>
        </Box>
      </AuthWell>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof AuthShell>;

export const CloudInstance: Story = {};

export const SelfHostedInstance: Story = {
  args: {
    isCloudInstance: false,
  },
};
