import type { Meta, StoryObj } from "@storybook/react-vite";

import { InlineExtensionPreferenceControls } from "./InlineExtensionPreferenceControls";

const meta: Meta<typeof InlineExtensionPreferenceControls> = {
  title: "Extensions / InlineExtensionPreferenceControls",
  component: InlineExtensionPreferenceControls,
};

export default meta;

export const Default: StoryObj<typeof InlineExtensionPreferenceControls> = {
  args: {
    extension: { id: "e", identifier: "e", label: "My widget", app: { id: "a", identifier: "a" } },
  },
};
