import { CircuitBreakerStateEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CircuitBreakerBadge } from "./CircuitBreakerBadge";

const meta: Meta<typeof CircuitBreakerBadge> = {
  title: "Extensions/InstalledExtensions/CircuitBreakerBadge",
  component: CircuitBreakerBadge,
  args: {
    lastStateChange: "2026-10-28T09:15:00Z",
  },
};

export default meta;

type Story = StoryObj<typeof CircuitBreakerBadge>;

export const HalfOpen: Story = {
  args: { state: CircuitBreakerStateEnum.HALF_OPEN },
};

export const Open: Story = {
  args: { state: CircuitBreakerStateEnum.OPEN },
};

export const WithoutLastStateChange: Story = {
  args: { state: CircuitBreakerStateEnum.OPEN, lastStateChange: null },
};
