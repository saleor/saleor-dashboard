import { type Container } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import AssignContainerDialog from "./AssignContainerDialog";

const containers: Container[] = [
  { id: "1", name: "Default Channel" },
  { id: "2", name: "Channel-PLN" },
  { id: "3", name: "Channel-EUR" },
  { id: "4", name: "Channel-GBP" },
];

const meta: Meta<typeof AssignContainerDialog> = {
  title: "Components/AssignContainerDialog",
  component: AssignContainerDialog,
  args: {
    open: true,
    confirmButtonState: "default",
    containers,
    loading: false,
    hasMore: false,
    labels: {
      title: "Assign channel",
      confirmBtn: "Assign",
      label: "Search channels",
      placeholder: "Search by name",
    },
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignContainerDialog>;

export const Default: Story = {};

/** Radio rows instead of checkboxes; confirm stays disabled until the pick changes. */
export const SingleSelection: Story = {
  args: { selectionMode: "single", selectedId: "2" },
};

/** First page in flight — the list is replaced by a throbber row. */
export const Loading: Story = {
  args: { containers: [], loading: true },
};

export const Empty: Story = {
  args: { containers: [], emptyMessage: "No channels found" },
};

/** Exclusion emptied every loaded page while the backend still has more. */
export const BackfillExhausted: Story = {
  args: {
    hasMore: true,
    excludeContainer: () => true,
    backfillExhaustedMessage: "Every channel loaded so far is already assigned.",
  },
};
