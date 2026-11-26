import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AuthShell } from "../Layout";
import { ResetPasswordSuccessPage } from "./ResetPasswordSuccessPage";

const meta: Meta<typeof ResetPasswordSuccessPage> = {
  title: "Auth / ResetPasswordSuccessPage",
  component: ResetPasswordSuccessPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story: StoryFn) => (
      <AuthShell isCloudInstance>
        <Story />
      </AuthShell>
    ),
  ],
  args: {
    onBack: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ResetPasswordSuccessPage>;

export const Default: Story = {};
