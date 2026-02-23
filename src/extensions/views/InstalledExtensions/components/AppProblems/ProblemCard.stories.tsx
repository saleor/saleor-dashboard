import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  criticalAppProblem,
  dismissedByUserProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "./fixtures";
import { ProblemCard } from "./ProblemCard/ProblemCard";

const meta: Meta<typeof ProblemCard> = {
  title: "Extensions/AppProblems/ProblemCard",
  component: ProblemCard,
};

export default meta;

type Story = StoryObj<typeof ProblemCard>;

export const Critical: Story = {
  args: {
    problem: criticalAppProblem,
    onForceClear: () => {},
  },
};

export const Warning: Story = {
  args: {
    problem: warningAppProblem,
  },
};

export const Dismissed: Story = {
  args: {
    problem: dismissedByUserProblem,
    dismissed: true,
  },
};

export const WebhookError: Story = {
  args: {
    problem: webhookDeliveryError,
  },
};
