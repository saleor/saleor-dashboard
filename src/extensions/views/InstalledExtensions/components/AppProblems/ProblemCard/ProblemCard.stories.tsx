import { AppTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  criticalAppProblem,
  dismissedByUserProblem,
  warningAppProblem,
  webhookDeliveryError,
} from "../fixtures";
import { ProblemCard } from "./ProblemCard";

const meta: Meta<typeof ProblemCard> = {
  title: "Extensions/AppProblems/ProblemCard",
  component: ProblemCard,
  args: {
    appId: "app-123",
    index: 0,
  },
};

export default meta;

type Story = StoryObj<typeof ProblemCard>;

export const Critical: Story = {
  args: {
    problem: criticalAppProblem,
    appType: AppTypeEnum.THIRDPARTY,
    isActive: true,
    onClearProblem: fn(),
    hasManagedAppsPermission: true,
  },
};

export const Warning: Story = {
  args: {
    problem: warningAppProblem,
    appType: AppTypeEnum.THIRDPARTY,
    isActive: true,
    onClearProblem: fn(),
    hasManagedAppsPermission: true,
  },
};

export const Dismissed: Story = {
  args: {
    problem: dismissedByUserProblem,
  },
};

export const WebhookError: Story = {
  args: {
    problem: webhookDeliveryError,
    appType: AppTypeEnum.THIRDPARTY,
  },
};

export const CriticalDisabledApp: Story = {
  args: {
    problem: criticalAppProblem,
    appType: AppTypeEnum.THIRDPARTY,
    isActive: false,
    onClearProblem: fn(),
    hasManagedAppsPermission: true,
  },
};

export const WarningDisabledApp: Story = {
  args: {
    problem: warningAppProblem,
    appType: AppTypeEnum.THIRDPARTY,
    isActive: false,
    onClearProblem: fn(),
    hasManagedAppsPermission: true,
  },
};
