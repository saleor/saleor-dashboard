import { products as productsFixture } from "@dashboard/products/fixtures";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ProductListDatagrid } from "./ProductListDatagrid";

const placeholderImage = "https://via.placeholder.com/64";
const products = productsFixture(placeholderImage);

const emptyLazyQueryResult = {
  data: undefined,
  loading: false,
  called: false,
  error: undefined,
  previousData: undefined,
  variables: undefined,
  networkStatus: 7,
  client: {} as any,
  observable: {} as any,
  fetchMore: fn(),
  refetch: fn(),
  startPolling: fn(),
  stopPolling: fn(),
  subscribeToMore: fn(),
  updateQuery: fn(),
  reobserve: fn(),
} as any;

const emptyAvailableColumnsAttributesOpts = [
  fn(),
  {
    ...emptyLazyQueryResult,
    variables: { search: "" },
  },
] as any;

const meta: Meta<typeof ProductListDatagrid> = {
  title: "Products/ProductListDatagrid",
  component: ProductListDatagrid,
  argTypes: {
    gridAttributesOpts: { table: { disable: true } },
    availableColumnsAttributesOpts: { table: { disable: true } },
    onRowClick: { table: { disable: true } },
    onSelectProductIds: { table: { disable: true } },
    onSort: { table: { disable: true } },
    onUpdateListSettings: { table: { disable: true } },
  },
  args: {
    products,
    loading: false,
    disabled: false,
    hasRowHover: true,
    selectedChannelId: "channel-1",
    activeAttributeSortId: "",
    sort: { sort: ProductListUrlSortField.name, asc: true },
    onSort: fn(),
    settings: { columns: [], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onRowClick: fn(),
    onSelectProductIds: fn(),
    gridAttributesOpts: emptyLazyQueryResult,
    availableColumnsAttributesOpts: emptyAvailableColumnsAttributesOpts,
    filterDependency: { label: "Channel", value: "channel-1" },
  },
};

export default meta;
type Story = StoryObj<typeof ProductListDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    products: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithoutChannel: Story = {
  args: {
    selectedChannelId: "",
  },
};
