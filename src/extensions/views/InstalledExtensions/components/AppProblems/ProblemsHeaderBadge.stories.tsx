import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProblemsHeaderBadge } from "./ProblemsHeaderBadge";

const meta: Meta<typeof ProblemsHeaderBadge> = {
  title: "Extensions/AppProblems/ProblemsHeaderBadge",
  component: ProblemsHeaderBadge,
};

export default meta;

type Story = StoryObj<typeof ProblemsHeaderBadge>;

export const Warning: Story = {
  args: {
    totalCount: 2,
    criticalCount: 0,
  },
};

export const Critical: Story = {
  args: {
    totalCount: 4,
    criticalCount: 2,
  },
};
