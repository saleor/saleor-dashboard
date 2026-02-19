import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import {
  criticalAppProblem,
  dismissedByUserProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "./fixtures";
import { ProblemCard } from "./ProblemCard";

const withLocale: Decorator = (Story: React.FC) => (
  <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
    <Story />
  </LocaleContext.Provider>
);

const meta: Meta<typeof ProblemCard> = {
  title: "Extensions/AppProblems/ProblemCard",
  component: ProblemCard,
  decorators: [withLocale],
};

export default meta;

type Story = StoryObj<typeof ProblemCard>;

export const Critical: Story = {
  args: {
    problem: criticalAppProblem,
    onForceClear: () => alert("Force clear clicked"),
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
