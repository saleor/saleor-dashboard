import { collections } from "@dashboard/collections/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CollectionListDatagrid } from "./CollectionListDatagrid";

const meta: Meta<typeof CollectionListDatagrid> = {
  title: "Collections/CollectionListDatagrid",
  component: CollectionListDatagrid,
  args: {
    collections,
    loading: false,
    disabled: false,
    selectedChannelId: "channel-1",
    hasRowHover: true,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "productCount", "availability"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectCollectionIds: fn(),
    onRowClick: fn(),
    filterDependency: { label: "Channel", value: "channel-1" },
  },
};

export default meta;
type Story = StoryObj<typeof CollectionListDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { collections: [] },
};

export const WithoutChannel: Story = {
  args: { selectedChannelId: "" },
};
