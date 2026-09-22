import { type ConfigurationItemFragment, ConfigurationTypeFieldEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PluginSettings } from "./PluginSettings";

const field = (
  overrides: Partial<ConfigurationItemFragment> & Pick<ConfigurationItemFragment, "name">,
): ConfigurationItemFragment => ({
  __typename: "ConfigurationItem",
  value: "",
  type: ConfigurationTypeFieldEnum.STRING,
  helpText: null,
  label: null,
  ...overrides,
});

const configuration: ConfigurationItemFragment[] = [
  field({
    name: "api-key",
    label: "API key",
    value: "sk_live_123456",
    helpText: "Secret key issued by the payment provider.",
  }),
  field({
    name: "webhook-payload",
    label: "Webhook payload",
    type: ConfigurationTypeFieldEnum.MULTILINE,
    value: '{\n  "event": "order.created"\n}',
    helpText: "Template used when calling the provider.",
  }),
  field({
    name: "install-log",
    label: "Installation log",
    type: ConfigurationTypeFieldEnum.OUTPUT,
    value: "Plugin installed successfully at 2026-03-18 09:31 UTC",
    helpText: "Read-only. Click to select the whole value.",
  }),
  field({
    name: "sandbox-mode",
    label: "Sandbox mode",
    type: ConfigurationTypeFieldEnum.BOOLEAN,
    value: "true",
    helpText: "Send requests to the provider's test environment.",
  }),
];

const meta: Meta<typeof PluginSettings> = {
  title: "Extensions/Plugins/PluginSettings",
  component: PluginSettings,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: { active: true, configuration },
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PluginSettings>;

export const Default: Story = {};

export const NoConfiguration: Story = {
  args: { data: { active: true, configuration: [] } },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: {
    errors: [{ field: "name", message: "This value is not accepted by the provider" }],
  },
};
