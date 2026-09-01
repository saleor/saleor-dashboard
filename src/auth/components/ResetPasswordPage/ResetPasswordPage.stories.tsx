import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ResetPasswordPage from "./ResetPasswordPage";

const meta: Meta<typeof ResetPasswordPage> = {
  title: "Auth/ResetPasswordPage",
  component: ResetPasswordPage,
  parameters: { layout: "fullscreen" },
  args: {
    disabled: false,
    error: "",
    onSubmit: fn(async () => []),
  },
};

export default meta;

type Story = StoryObj<typeof ResetPasswordPage>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: { error: "Provided email address does not exist in our database." },
};
