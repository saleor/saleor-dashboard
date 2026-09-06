import { pageListProps, sortPageProps } from "@dashboard/fixtures";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import WarehouseList from "./WarehouseList";

const meta: Meta<typeof WarehouseList> = {
  title: "Warehouses/WarehouseList",
  component: WarehouseList,
  args: {
    ...pageListProps.default,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: WarehouseListUrlSortField.name },
    warehouses: warehouseList,
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WarehouseList>;

export const Default: Story = {};

export const Loading: Story = {
  args: { ...pageListProps.loading, warehouses: undefined },
};

export const Empty: Story = {
  args: { warehouses: [] },
};

export const WithSearch: Story = {
  args: { search: { placeholder: "Search warehouses", onSearchChange: fn() } },
};
