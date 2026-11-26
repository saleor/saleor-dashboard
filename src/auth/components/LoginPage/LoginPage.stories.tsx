import { CLOUD_PLUGIN_ID, SSO_PLUGIN_ID } from "@dashboard/auth/utils";
import { type AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AuthShell } from "../Layout";
import { LoginPage } from "./LoginPage";

type ExternalAuthList =
  AvailableExternalAuthenticationsQuery["shop"]["availableExternalAuthentications"];

const externalAuthentications: ExternalAuthList = [
  {
    __typename: "ExternalAuthentication",
    id: CLOUD_PLUGIN_ID,
    name: "Saleor Cloud",
  },
];

const multipleExternalAuthentications: ExternalAuthList = [
  ...externalAuthentications,
  {
    __typename: "ExternalAuthentication",
    id: SSO_PLUGIN_ID,
    name: "OpenID Connect",
  },
];

const meta: Meta<typeof LoginPage> = {
  title: "Auth / LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: StoryFn) => (
      <AuthShell isCloudInstance>
        <Story />
      </AuthShell>
    ),
  ],
  args: {
    errors: [],
    disabled: false,
    loading: false,
    externalAuthentications,
    passwordLoginEnabled: true,
    lastLoginMethod: null,
    showSupportLink: true,
    onExternalAuthentication: fn(),
    onSubmit: fn(async () => []),
  },
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {};

export const MultipleExternalProviders: Story = {
  args: {
    externalAuthentications: multipleExternalAuthentications,
    lastLoginMethod: CLOUD_PLUGIN_ID,
  },
};

export const PasswordOnly: Story = {
  args: {
    externalAuthentications: [],
    lastLoginMethod: null,
  },
};

export const ExternalAuthOnly: Story = {
  args: {
    passwordLoginEnabled: false,
  },
};

export const WithInvalidCredentialsError: Story = {
  args: {
    errors: ["invalidCredentials"],
    lastLoginMethod: "password",
  },
};

export const PasswordLoginDisabled: Story = {
  args: {
    passwordLoginEnabled: false,
    externalAuthentications: [],
    lastLoginMethod: null,
  },
};

export const LoginMethodsFailedToLoad: Story = {
  args: {
    passwordLoginEnabled: false,
    externalAuthentications: undefined,
    loginMethodsError: true,
    onRetryLoginMethods: fn(),
    lastLoginMethod: null,
  },
};
