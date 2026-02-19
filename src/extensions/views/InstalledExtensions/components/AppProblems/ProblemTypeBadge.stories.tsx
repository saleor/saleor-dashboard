import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { ProblemTypeBadge } from "./ProblemTypeBadge";

const withLocale: Decorator = (Story: React.FC) => (
  <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
    <Story />
  </LocaleContext.Provider>
);

const meta: Meta<typeof ProblemTypeBadge> = {
  title: "Extensions/AppProblems/ProblemTypeBadge",
  component: ProblemTypeBadge,
  decorators: [withLocale],
};

export default meta;

type Story = StoryObj<typeof ProblemTypeBadge>;

export const AppType: Story = {
  args: { typename: "AppProblem" },
};

export const WebhookDeliveryType: Story = {
  args: { typename: "WebhookDeliveryError" },
};
