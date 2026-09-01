import { type WebhookEventTypeAsyncEnum, type WebhookEventTypeSyncEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type WebhookFormData } from "../../WebhookDetailsPage";
import { WebhookHeaders } from "./WebhookHeaders";

const data = (customHeaders: string): WebhookFormData => ({
  syncEvents: [] as WebhookEventTypeSyncEnum[],
  asyncEvents: [] as WebhookEventTypeAsyncEnum[],
  isActive: true,
  name: "Order webhook",
  targetUrl: "https://example.com/webhook",
  subscriptionQuery: "",
  customHeaders,
});

const meta: Meta<typeof WebhookHeaders> = {
  title: "Extensions/WebhookHeaders",
  component: WebhookHeaders,
  args: {
    data: data('{"x-tenant":"acme","authorization-token":"secret"}'),
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WebhookHeaders>;

/** Existing headers auto-expand the section. */
export const Default: Story = {};

/** No headers yet — the section stays collapsed behind its toggle. */
export const Empty: Story = {
  args: { data: data("{}") },
};

/** Header names outside the allowed prefixes are flagged inline. */
export const WithInvalidHeader: Story = {
  args: { data: data('{"content-type":"application/json"}') },
};
