import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import {
  criticalAppProblem,
  dismissedByAppProblem,
  dismissedByUserProblem,
  extraWarningProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "./fixtures";
import { ProblemsList } from "./ProblemsList";

const withLocale: Decorator = (Story: React.FC) => (
  <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
    <Story />
  </LocaleContext.Provider>
);

const meta: Meta<typeof ProblemsList> = {
  title: "Extensions/AppProblems/ProblemsList",
  component: ProblemsList,
  decorators: [withLocale],
};

export default meta;

type Story = StoryObj<typeof ProblemsList>;

export const SingleProblem: Story = {
  args: {
    problems: [warningAppProblem],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: () => alert("Clear problem"),
  },
};

export const MixedProblems: Story = {
  args: {
    problems: [criticalAppProblem, warningAppProblem, webhookDeliveryError],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: () => alert("Clear problem"),
  },
};

export const ManyProblemsWithShowMore: Story = {
  args: {
    problems: [
      criticalAppProblem,
      warningAppProblem,
      webhookDeliveryError,
      dismissedByUserProblem,
      dismissedByAppProblem,
      extraWarningProblem,
    ],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: () => alert("Clear problem"),
  },
};

export const AllDismissed: Story = {
  args: {
    problems: [dismissedByUserProblem, dismissedByAppProblem],
    appId: "app-123",
    hasManagedAppsPermission: true,
  },
};

export const WithoutPermissions: Story = {
  args: {
    problems: [criticalAppProblem, warningAppProblem],
    appId: "app-123",
    hasManagedAppsPermission: false,
  },
};
