import { type MetadataInput } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { MetadataCardTable } from "./MetadataCardTable";

const data: MetadataInput[] = [
  { key: "integration.id", value: "acme-42" },
  { key: "warehouse.zone", value: "EU-central" },
  {
    key: "notes",
    value: "Long-form value that wraps across the textarea so row height growth stays visible.",
  },
];

const meta: Meta<typeof MetadataCardTable> = {
  title: "Components/MetadataCardTable",
  component: MetadataCardTable,
  args: {
    data,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MetadataCardTable>;

/** Page layout — full-width table with its own header row and page gutters. */
export const Default: Story = {};

/** DetailGroupBox layout: header bar above a bleeding table, inset cell padding. */
export const InModal: Story = {
  args: { inModal: true },
};

/** No form around it — inputs render read-only and the Actions column disappears. */
export const Readonly: Story = {
  args: { readonly: true },
};

export const ReadonlyInModal: Story = {
  args: { readonly: true, inModal: true },
};

/** Temporarily unavailable, e.g. while the form submits. */
export const Disabled: Story = {
  args: { disabled: true },
};

/** Blank keys pick up the form error; the row grows to fit the message. */
export const WithKeyErrors: Story = {
  args: {
    data: [{ key: "", value: "no key" }, ...data],
    error: "Metadata key cannot be empty",
  },
};

export const WithKeyErrorsInModal: Story = {
  args: {
    data: [{ key: "", value: "no key" }, ...data],
    error: "Metadata key cannot be empty",
    inModal: true,
  },
};

/** Renders nothing at all rather than an empty table. */
export const Empty: Story = {
  args: { data: [] },
};
