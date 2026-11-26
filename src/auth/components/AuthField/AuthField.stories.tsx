import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { AuthField } from "./AuthField";

const meta: Meta<typeof AuthField> = {
  title: "Auth / AuthField",
  component: AuthField,
  decorators: [
    (Story: StoryFn) => (
      <Box padding={6} __maxWidth="400px">
        <Story />
      </Box>
    ),
  ],
  args: {
    id: "auth-field-email",
    label: "Email",
    type: "email",
    placeholder: "name@example.com",
  },
};

export default meta;
type Story = StoryObj<typeof AuthField>;

export const Default: Story = {};

export const PasswordWithAction: Story = {
  args: {
    id: "auth-field-password",
    label: "Password",
    showPasswordToggle: true,
    placeholder: "",
    labelEnd: <a href="#reset">Forgot password?</a>,
  },
};

export const WithError: Story = {
  args: {
    id: "auth-field-error",
    label: "Confirm password",
    showPasswordToggle: true,
    error: true,
    helperText: "Passwords do not match",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "staff@example.com",
  },
};
