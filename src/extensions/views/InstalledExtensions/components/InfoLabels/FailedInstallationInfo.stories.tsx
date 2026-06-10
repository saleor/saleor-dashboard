import type { Meta, StoryObj } from "@storybook/react-vite";

import { FailedInstallationInfo } from "./FailedInstallationInfo";

const meta: Meta<typeof FailedInstallationInfo> = {
  title: "Extensions/InstalledExtensions/InfoLabels/FailedInstallationInfo",
  component: FailedInstallationInfo,
};

export default meta;
type Story = StoryObj<typeof FailedInstallationInfo>;

export const Default: Story = {};
