import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  criticalAppProblem,
  dismissedByAppProblem,
  dismissedByUserProblem,
  extraWarningProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "./fixtures";
import { ProblemsList } from "./ProblemsList";

const meta: Meta<typeof ProblemsList> = {
  title: "Extensions/AppProblems/ProblemsList",
  component: ProblemsList,
};

export default meta;

type Story = StoryObj<typeof ProblemsList>;

export const SingleProblem: Story = {
  args: {
    problems: [warningAppProblem],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: () => {},
  },
};

export const MixedProblems: Story = {
  args: {
    problems: [criticalAppProblem, warningAppProblem, webhookDeliveryError],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: () => {},
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
    onClearProblem: () => {},
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
