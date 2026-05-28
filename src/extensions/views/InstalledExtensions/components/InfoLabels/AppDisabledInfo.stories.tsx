import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppDisabledInfo } from "./AppDisabledInfo";

const meta: Meta<typeof AppDisabledInfo> = {
  title: "Extensions/InstalledExtensions/InfoLabels/AppDisabledInfo",
  component: AppDisabledInfo,
};

export default meta;
type Story = StoryObj<typeof AppDisabledInfo>;

export const Default: Story = {};
