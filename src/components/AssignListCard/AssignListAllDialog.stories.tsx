import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AssignListAllDialog } from "./AssignListAllDialog";
import { type AssignListCardItem } from "./AssignListCard";

const meta: Meta<typeof AssignListAllDialog> = {
  title: "Components / AssignListAllDialog",
  component: AssignListAllDialog,
  args: {
    open: true,
    title: "Shipping zones",
    items: Array.from({ length: 60 }, (_, index) => ({
      id: `zone-${index}`,
      name: `Zone ${index + 1}`,
      href: `/shipping/zone-${index}`,
    })),
    loading: false,
    hasMore: false,
    onFetchMore: fn(),
    searchLabel: "Search shipping zones",
    searchPlaceholder: "Search by shipping zone name",
    noMatchMessage: "No shipping zones found",
    removable: true,
    removeLabel: (item: AssignListCardItem): string => `Remove ${item.name}`,
    onRemoveItem: fn(),
    onClose: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof AssignListAllDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { items: [], loading: true },
};

export const ReadOnly: Story = {
  args: { removable: false },
};
