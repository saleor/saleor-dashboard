import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FailedInstallationActions } from "./FailedInstallationActions";

const meta: Meta<typeof FailedInstallationActions> = {
  title: "Extensions/InstalledExtensions/FailedInstallationActions",
  component: FailedInstallationActions,
  args: {
    onRetry: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FailedInstallationActions>;

export const Default: Story = {};
