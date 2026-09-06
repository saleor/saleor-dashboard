import { type WebhookFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { WebhooksList } from "./WebhooksList";

const app: WebhookFragment["app"] = { __typename: "App", id: "app-1", name: "Acme" };

const webhooks: WebhookFragment[] = [
  { __typename: "Webhook", id: "1", name: "Order created", isActive: true, app },
  { __typename: "Webhook", id: "2", name: "Product updated", isActive: false, app },
  { __typename: "Webhook", id: "3", name: null, isActive: true, app },
];

const meta: Meta<typeof WebhooksList> = {
  title: "Extensions/WebhooksList",
  component: WebhooksList,
  args: {
    webhooks,
    createHref: "/extensions/custom/app-1/webhooks/add",
    hasManagedAppsPermission: true,
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WebhooksList>;

export const Default: Story = {};

/** Without MANAGE_APPS the table collapses to a single explanatory column. */
export const WithoutPermission: Story = {
  args: { hasManagedAppsPermission: false },
};

export const Loading: Story = {
  args: { webhooks: undefined },
};

export const Empty: Story = {
  args: { webhooks: [] },
};
