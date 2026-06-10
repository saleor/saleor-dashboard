import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductTableSkeleton } from "./ProductTableSkeleton";

const meta: Meta<typeof ProductTableSkeleton> = {
  title: "Collections/CollectionProducts/ProductTableSkeleton",
  component: ProductTableSkeleton,
};

export default meta;
type Story = StoryObj<typeof ProductTableSkeleton>;

export const Default: Story = {};
