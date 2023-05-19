import {
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { warehouseList } from "../../fixtures";
import WarehouseListPage, { WarehouseListPageProps } from "./WarehouseListPage";

const props: WarehouseListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  limits,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WarehouseListUrlSortField.name,
  },
  warehouses: warehouseList,
};

const meta: Meta<typeof WarehouseListPage> = {
  title: "Warehouses / Warehouse list",
  decorators: [PaginatorContextDecorator],
  component: WarehouseListPage,
};
export default meta;
type Story = StoryObj<typeof WarehouseListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    warehouses: undefined,
    currentTab: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    warehouses: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoLimits: Story = {
  args: {
    ...props,
    limits: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const LimitsReached: Story = {
  args: {
    ...props,
    limits: limitsReached,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
