// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder255x255.png";
import { defaultListSettings } from "@dashboard/config";
import {
  fetchMoreProps,
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import {
  gridAttributesResult,
  products as productListFixture,
} from "@dashboard/products/fixtures";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { productListFilterOpts } from "@dashboard/products/views/ProductList/fixtures";
import { ListViews } from "@dashboard/types";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import ProductListPage, { ProductListPageProps } from "./ProductListPage";

const products = productListFixture(placeholderImage);

const props: ProductListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...fetchMoreProps,
  ...{
    ...sortPageProps,
    sort: {
      ...sortPageProps.sort,
      sort: ProductListUrlSortField.name,
    },
    onProductsDelete: () => undefined,
    onSelectProductIds: () => undefined,
    channels: [],
    columnQuery: "",
    currentTab: 0,
    hasPresetsChanged: false,
    onTabSave: () => undefined,
    onTabUpdate: () => undefined,
    availableColumnsAttributesOpts: [
      () => undefined,
      { data: undefined },
    ] as any,
    onColumnQueryChange: () => undefined,
  },
  activeAttributeSortId: undefined,
  currencySymbol: "USD",
  defaultSettings: defaultListSettings[ListViews.PRODUCT_LIST],
  filterOpts: productListFilterOpts,
  gridAttributesOpts: {
    data: gridAttributesResult,
  } as any,
  limits,
  onExport: () => undefined,
  products,
  selectedChannelId: "123",
  selectedProductIds: ["123"],
  clearRowSelection: () => undefined,
  settings: {
    ...pageListProps.default.settings,
    columns: ["availability", "productType", "price"],
  },
};

const meta: Meta<typeof ProductListPage> = {
  title: "Products / Product list",
  decorators: [PaginatorContextDecorator],
  component: ProductListPage,
};
export default meta;
type Story = StoryObj<typeof ProductListPage>;

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
    products: undefined,
    currentTab: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.9, pauseAnimationAtEnd: true },
  },
};

export const WithData: Story = {
  args: {
    ...props,
    products,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    products: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoChannels: Story = {
  args: {
    ...props,
    selectedChannelId: "",
    products: products.map(product => ({
      ...product,
      channelListings: [],
    })),
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
