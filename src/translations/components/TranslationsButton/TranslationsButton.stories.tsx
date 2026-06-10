import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TranslationsButton } from "./TranslationsButton";

const meta: Meta<typeof TranslationsButton> = {
  title: "Translations/TranslationsButton",
  component: TranslationsButton,
  args: {
    onClick: fn(),
    children: "Translate",
  },
};

export default meta;
type Story = StoryObj<typeof TranslationsButton>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const IconOnly: Story = {
  args: { children: undefined },
};
