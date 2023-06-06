import { categories } from "@dashboard/categories/fixtures";
import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import CategoryListPage, { CategoryTableProps } from "./CategoryListPage";

const categoryTableProps: CategoryTableProps = {
  categories,
  onAdd: undefined,
  ...listActionsProps,
  ...tabPageProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: CategoryListUrlSortField.name,
  },
};

const meta: Meta<typeof CategoryListPage> = {
  title: "Categories / Category list",
  decorators: [PaginatorContextDecorator],
  component: CategoryListPage,
};
export default meta;
type Story = StoryObj<typeof CategoryListPage>;

export const Default: Story = {
  args: {
    ...categoryTableProps,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...categoryTableProps,
    categories: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Empty: Story = {
  args: {
    ...categoryTableProps,
    categories: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
