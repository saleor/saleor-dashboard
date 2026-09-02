import { type AppUpdateMutation } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CustomExtensionTokens } from "./CustomExtensionTokens";

type Tokens = NonNullable<NonNullable<AppUpdateMutation["appUpdate"]>["app"]>["tokens"];

const tokens: Tokens = [
  { __typename: "AppToken", id: "1", name: "CI pipeline", authToken: "1a2b" },
  { __typename: "AppToken", id: "2", name: null, authToken: "3c4d" },
];

const meta: Meta<typeof CustomExtensionTokens> = {
  title: "Extensions/CustomExtensionTokens",
  component: CustomExtensionTokens,
  args: {
    tokens,
    hasManagedAppsPermission: true,
    isLoading: false,
    onCreate: fn(),
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CustomExtensionTokens>;

export const Default: Story = {};

/** Without MANAGE_APPS the rows are replaced by an explanation. */
export const WithoutPermission: Story = {
  args: { hasManagedAppsPermission: false },
};

export const Loading: Story = {
  args: { tokens: null, isLoading: true },
};

export const Empty: Story = {
  args: { tokens: [] },
};
