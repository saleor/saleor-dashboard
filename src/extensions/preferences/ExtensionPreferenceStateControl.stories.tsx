import { type Meta, type StoryObj } from "@storybook/react-vite";

import { ExtensionPreferenceStateControl } from "./ExtensionPreferenceStateControl";

const meta: Meta<typeof ExtensionPreferenceStateControl> = {
  title: "Extensions / ExtensionPreferenceStateControl",
  component: ExtensionPreferenceStateControl,
  args: { value: "default", disabled: false },
};

export default meta;

export const Default: StoryObj<typeof ExtensionPreferenceStateControl> = {};
