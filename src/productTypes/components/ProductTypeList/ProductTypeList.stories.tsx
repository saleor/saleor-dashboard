import { listActionsProps, pageListProps, sortPageProps } from "@dashboard/fixtures";
import { productTypes } from "@dashboard/productTypes/fixtures";
import { ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";

import ProductTypeList from "./ProductTypeList";

const meta: Meta<typeof ProductTypeList> = {
  title: "Product types/ProductTypeList",
  component: ProductTypeList,
  args: {
    ...listActionsProps,
    ...pageListProps.default,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: ProductTypeListUrlSortField.name },
    productTypes,
  },
};

export default meta;
type Story = StoryObj<typeof ProductTypeList>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selected: 2, isChecked: () => true },
};

export const Loading: Story = {
  args: { ...pageListProps.loading, productTypes: undefined },
};

export const Empty: Story = {
  args: { productTypes: [] },
};
