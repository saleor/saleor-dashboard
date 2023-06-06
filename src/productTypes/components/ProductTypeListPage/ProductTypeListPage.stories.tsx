import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { ProductTypeConfigurable, ProductTypeEnum } from "@dashboard/graphql";
import { ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { productTypes } from "../../fixtures";
import ProductTypeListPage, {
  ProductTypeListPageProps,
} from "./ProductTypeListPage";

const props: ProductTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    configurable: {
      active: false,
      value: ProductTypeConfigurable.CONFIGURABLE,
    },
    type: {
      active: false,
      value: ProductTypeEnum.SHIPPABLE,
    },
  },
  sort: {
    ...sortPageProps.sort,
    sort: ProductTypeListUrlSortField.name,
  },
  ...tabPageProps,
  productTypes,
};

const meta: Meta<typeof ProductTypeListPage> = {
  title: "Product types / Product types list",
  decorators: [PaginatorContextDecorator],
  component: ProductTypeListPage,
};
export default meta;
type Story = StoryObj<typeof ProductTypeListPage>;

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
    productTypes: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    productTypes: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
