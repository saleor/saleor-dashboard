import { categories } from "@dashboard/categories/fixtures";
import { type CategoryListRow } from "@dashboard/categories/views/CategoryList/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { CategoryListDatagrid } from "./CategoryListDatagrid";

const rootRows: CategoryListRow[] = categories.map(category => ({
  type: "category" as const,
  category,
  depth: 0,
  parentId: null,
}));

const expandedRows: CategoryListRow[] = [
  rootRows[0],
  {
    type: "category",
    category: {
      ...categories[0],
      id: "child-1",
      name: "Phones",
      children: { __typename: "CategoryCountableConnection", totalCount: 0 },
      products: { __typename: "ProductCountableConnection", totalCount: 12 },
    },
    depth: 1,
    parentId: categories[0].id,
  },
  {
    type: "category",
    category: {
      ...categories[0],
      id: "child-2",
      name: "Laptops",
      children: { __typename: "CategoryCountableConnection", totalCount: 0 },
      products: { __typename: "ProductCountableConnection", totalCount: 8 },
    },
    depth: 1,
    parentId: categories[0].id,
  },
  {
    type: "load-more",
    parentId: categories[0].id,
    depth: 1,
    remainingCount: 25,
  },
  ...rootRows.slice(1),
];

const meta: Meta<typeof CategoryListDatagrid> = {
  title: "Categories/CategoryListDatagrid",
  component: CategoryListDatagrid,

  args: {
    rows: rootRows,
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "subcategories", "products"], rowNumber: 20 },
    onUpdateListSettings: fn(),
    onSelectCategoriesIds: fn(),
  },
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof CategoryListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { rows: [] },
};

export const WithoutSort: Story = {
  args: {
    sort: undefined,
    onSort: undefined,
  },
};

export const ExpandedSubcategories: Story = {
  args: {
    rows: expandedRows,
    isCategoryExpanded: (categoryId: string) => categoryId === categories[0].id,
    onCategoryExpandToggle: fn(),
    getCategoryDepth: (categoryId: string) =>
      expandedRows.find(row => row.type === "category" && row.category.id === categoryId)?.depth ??
      0,
    onLoadMoreSubcategories: fn(),
  },
};
