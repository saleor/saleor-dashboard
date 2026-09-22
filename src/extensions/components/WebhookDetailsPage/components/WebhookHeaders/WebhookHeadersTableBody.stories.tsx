import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { type Header } from "./utils";
import { WebhookHeadersTableBody } from "./WebhookHeadersTableBody";

const headers: Header[] = [
  { name: "x-tenant", value: "acme" },
  { name: "authorization-token", value: "secret" },
];

const meta: Meta<typeof WebhookHeadersTableBody> = {
  title: "Extensions/WebhookHeadersTableBody",
  component: WebhookHeadersTableBody,
  render: (args: ComponentProps<typeof WebhookHeadersTableBody>) => (
    <ResponsiveTable>
      <WebhookHeadersTableBody {...args} />
    </ResponsiveTable>
  ),
  args: { headers, onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof WebhookHeadersTableBody>;

export const Default: Story = {};

/** A rejected header name keeps its row and turns the input red. */
export const WithError: Story = {
  args: { headers: [...headers, { name: "content-type", value: "text/plain", error: true }] },
};

/** Freshly added row before anything is typed. */
export const EmptyRow: Story = {
  args: { headers: [{ name: "", value: "", error: false }] },
};

export const Empty: Story = {
  args: { headers: [] },
};
