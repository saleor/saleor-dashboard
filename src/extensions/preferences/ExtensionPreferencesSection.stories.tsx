import { type Meta, type StoryObj } from "@storybook/react-vite";

import { ExtensionPreferencesSection } from "./ExtensionPreferencesSection";

const meta: Meta<typeof ExtensionPreferencesSection> = {
  title: "Extensions / ExtensionPreferencesSection",
  component: ExtensionPreferencesSection,
};

export default meta;

// Relies on Apollo + auth context via the global Storybook decorators.
export const Default: StoryObj<typeof ExtensionPreferencesSection> = {};
