import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CategoryProductListDatagrid } from "./CategoryProductListDatagrid";

const mockProducts = [
  {
    id: "prod-1",
    name: "T-Shirt",
    thumbnail: { url: "https://via.placeholder.com/64", __typename: "Image" as const },
    productType: { id: "pt-1", name: "Apparel", __typename: "ProductType" as const },
  },
  {
    id: "prod-2",
    name: "Hoodie",
    thumbnail: { url: "https://via.placeholder.com/64", __typename: "Image" as const },
    productType: { id: "pt-1", name: "Apparel", __typename: "ProductType" as const },
  },
] as any;

const meta: Meta<typeof CategoryProductListDatagrid> = {
  title: "Categories/CategoryProductListDatagrid",
  component: CategoryProductListDatagrid,
  args: {
    products: mockProducts,
    disabled: false,
    settings: { columns: [], rowsPerPage: 20 },
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
