import { categories } from "@dashboard/categories/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { CategoryListDatagrid } from "./CategoryListDatagrid";

const meta: Meta<typeof CategoryListDatagrid> = {
  title: "Categories/CategoryListDatagrid",
  component: CategoryListDatagrid,

  args: {
    rows: categories.map(category => ({
      type: "category" as const,
      category,
      depth: 0,
      parentId: null,
    })),
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "subcategories", "products"], rowsPerPage: 20 },
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
