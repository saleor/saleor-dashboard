import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { AuthNotice } from "./AuthNotice";

const meta: Meta<typeof AuthNotice> = {
  title: "Auth / AuthNotice",
  component: AuthNotice,
  decorators: [
    (Story: StoryFn) => (
      <Box padding={6} __maxWidth="380px">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthNotice>;

export const Error: Story = {
  args: {
    tone: "error",
    children: "Your username and/or password are incorrect. Please try again.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    blink: true,
    children:
      "You are currently logged in using an external identity provider. Contact your organization's administrator if you have trouble authenticating.",
  },
};

export const Info: Story = {
  args: {
    tone: "info",
    children: "Enter the email linked to your staff account to receive a reset link.",
  },
};

export const Success: Story = {
  args: {
    tone: "success",
    children: "Password reset instructions have been sent to your email address.",
  },
};
