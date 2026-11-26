import type { Meta, StoryObj } from "@storybook/react-vite";

import { InstalledAppDetails } from "./InstalledAppDetails";
import { installedAppStory } from "./storyFixtures";

const meta: Meta<typeof InstalledAppDetails> = {
  title: "Extensions/Manage app/Details",
  component: InstalledAppDetails,
  args: {
    app: installedAppStory,
  },
};

export default meta;
type Story = StoryObj<typeof InstalledAppDetails>;

export const Default: Story = {};

export const Deprecated: Story = {
  args: {
    app: { ...installedAppStory, deprecationReason: "Use the Klaviyo v2 app instead." },
  },
};
