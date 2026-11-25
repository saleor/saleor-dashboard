import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { ArrowRight } from "lucide-react";

import { AuthWell } from "../AuthWell/AuthWell";
import { LastLoginIndicator } from "../LoginPage/LastLoginIndicator";
import { AuthButton } from "./AuthButton";

const meta: Meta<typeof AuthButton> = {
  title: "Auth / AuthButton",
  component: AuthButton,
  decorators: [
    (Story: StoryFn) => (
      <div style={{ maxWidth: 460 }}>
        <AuthWell>
          <Story />
        </AuthWell>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthButton>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: (
      <>
        Log in
        <ArrowRight size={14} aria-hidden="true" />
      </>
    ),
  },
};

export const PrimaryWithBadge: Story = {
  args: {
    variant: "primary",
    badge: <LastLoginIndicator id="auth-last-used" />,
    children: (
      <>
        Log in
        <ArrowRight size={14} aria-hidden="true" />
      </>
    ),
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Log in",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Continue with Saleor Cloud",
  },
};

export const SecondaryWithBadge: Story = {
  args: {
    variant: "secondary",
    badge: <LastLoginIndicator id="auth-last-used" />,
    children: "Continue with Saleor Cloud",
  },
};
