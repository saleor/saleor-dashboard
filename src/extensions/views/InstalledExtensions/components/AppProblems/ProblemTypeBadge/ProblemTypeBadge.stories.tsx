import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProblemTypeBadge } from "./ProblemTypeBadge";

const meta: Meta<typeof ProblemTypeBadge> = {
  title: "Extensions/AppProblems/ProblemTypeBadge",
  component: ProblemTypeBadge,
};

export default meta;

type Story = StoryObj<typeof ProblemTypeBadge>;

export const AppType: Story = {
  args: { typename: "AppProblem" },
};

export const WebhookDeliveryType: Story = {
  args: { typename: "WebhookDeliveryError" },
};
