import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { AuthWell } from "./AuthWell";

const meta: Meta<typeof AuthWell> = {
  title: "Auth / AuthWell",
  component: AuthWell,
  decorators: [
    (Story: StoryFn) => (
      <Box padding={8} __maxWidth="520px">
        <Story />
      </Box>
    ),
  ],
  args: {
    children: (
      <Box display="flex" flexDirection="column" gap={2}>
        <Text as="h2" size={6} fontWeight="bold">
          Welcome back
        </Text>
        <Text size={3} color="default2">
          Log in to your Saleor Dashboard.
        </Text>
      </Box>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof AuthWell>;

export const Default: Story = {};
