import { categories } from "@dashboard/categories/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CategoryListDatagrid } from "./CategoryListDatagrid";

const meta: Meta<typeof CategoryListDatagrid> = {
  title: "Categories/CategoryListDatagrid",
  component: CategoryListDatagrid,

  args: {
    categories,
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "subcategories", "products"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectCategoriesIds: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CategoryListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { categories: [] },
};

export const WithoutSort: Story = {
  args: {
    sort: undefined,
    onSort: undefined,
  },
};
