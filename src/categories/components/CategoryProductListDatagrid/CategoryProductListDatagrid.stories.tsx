import { type CategoryDetailsQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CategoryProductListDatagrid } from "./CategoryProductListDatagrid";

const mockProducts: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["products"]> = [
  {
    __typename: "Product",
    id: "prod-1",
    name: "T-Shirt",
    thumbnail: { url: "https://via.placeholder.com/64", __typename: "Image" },
  },
  {
    __typename: "Product",
    id: "prod-2",
    name: "Hoodie",
    thumbnail: { url: "https://via.placeholder.com/64", __typename: "Image" },
  },
];

const meta: Meta<typeof CategoryProductListDatagrid> = {
  title: "Categories/CategoryProductListDatagrid",
  component: CategoryProductListDatagrid,
  parameters: {
    chromatic: { diffThreshold: 0.3, delay: 500 },
  },
  args: {
    products: mockProducts,
    disabled: false,
    settings: { columns: ["name"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectProductsIds: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CategoryProductListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { products: [] },
};
