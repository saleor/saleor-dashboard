import { AppTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  criticalAppProblem,
  dismissedByAppProblem,
  dismissedByUserProblem,
  extraWarningProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "../fixtures";
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
    onClearProblem: fn(),
  },
};

export const MixedProblems: Story = {
  args: {
    problems: [criticalAppProblem, warningAppProblem, webhookDeliveryError],
    appId: "app-123",
    hasManagedAppsPermission: true,
    onClearProblem: fn(),
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
    onClearProblem: fn(),
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

export const DisabledAppProblems: Story = {
  args: {
    problems: [criticalAppProblem, warningAppProblem, webhookDeliveryError],
    appId: "app-123",
    appType: AppTypeEnum.THIRDPARTY,
    isActive: false,
    hasManagedAppsPermission: true,
    onClearProblem: fn(),
  },
};
