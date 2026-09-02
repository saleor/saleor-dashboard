import { type ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PluginSecretFieldDialog } from "./PluginSecretFieldDialog";

const field = (type: ConfigurationTypeFieldEnum, label: string): ConfigurationItemFragment => ({
  __typename: "ConfigurationItem",
  name: "secret",
  value: null,
  type,
  helpText: null,
  label,
});

const meta: Meta<typeof PluginSecretFieldDialog> = {
  title: "Extensions/Plugins/PluginSecretFieldDialog",
  component: PluginSecretFieldDialog,
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
  },
  args: {
    open: true,
    confirmButtonState: "default",
    field: field(ConfigurationTypeFieldEnum.SECRET, "API secret"),
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PluginSecretFieldDialog>;

export const Secret: Story = {};

export const Password: Story = {
  args: { field: field(ConfigurationTypeFieldEnum.PASSWORD, "Password") },
};

export const Multiline: Story = {
  args: { field: field(ConfigurationTypeFieldEnum.SECRETMULTILINE, "Private key") },
};

export const Loading: Story = {
  name: "Loading (no field yet)",
  args: { field: undefined as unknown as ConfigurationItemFragment },
};
