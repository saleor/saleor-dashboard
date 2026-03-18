import { getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ComponentType } from "react";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, userEvent, within } from "storybook/test";

import { ProductOrganization } from "./ProductOrganization";

type Props = ComponentProps<typeof ProductOrganization>;

const categories = getChoicesWithAncestors([
  {
    id: "1",
    name: "Shoes",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "2",
    name: "Sneakers",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "3",
    name: "Running",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
]);

const categoriesWithAncestors = getChoicesWithAncestors([
  {
    id: "1",
    name: "Shoes",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "2",
    name: "Sneakers",
    ancestors: {
      edges: [{ node: { id: "2-1", name: "Shoes" } }],
    },
    parent: { id: "2-1", name: "Shoes" },
    level: 1,
  },
  {
    id: "3",
    name: "Running",
    ancestors: {
      edges: [{ node: { id: "3-1", name: "Shoes" } }],
    },
    parent: { id: "4-2", name: "Trekking" },
    level: 4,
  },
]);

const meta: Meta<typeof ProductOrganization> = {
  title: "Products/ProductOrganization",
  component: ProductOrganization,
  decorators: [
    (Story: ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    fetchCategories: { table: { disable: true } },
    fetchCollections: { table: { disable: true } },
    fetchMoreCategories: { table: { disable: true } },
    fetchMoreCollections: { table: { disable: true } },
    onCategoryChange: { table: { disable: true } },
    onCollectionChange: { table: { disable: true } },
    onProductTypeChange: { table: { disable: true } },
  },
  args: {
    canChangeType: false,
    categories,
    categoryInputDisplayValue: "",
    collections: [],
    collectionsInputDisplayValue: [],
    data: { category: "", collections: [] },
    disabled: false,
    errors: [],
    productType: { hasVariants: true, id: "pt-1", name: "Physical Product" },
    fetchCategories: fn(),
    fetchCollections: fn(),
    fetchMoreCategories: { hasMore: false, loading: false, onFetchMore: fn() },
    fetchMoreCollections: { hasMore: false, loading: false, onFetchMore: fn() },
    onCategoryChange: fn(),
    onCollectionChange: fn(),
    onProductTypeChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductOrganization>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act
    await userEvent.click(categoryCombobox);

    // Assert
    await expect(await within(document.body).findByText("Shoes")).toBeInTheDocument();
    await expect(within(document.body).getByText("Sneakers")).toBeInTheDocument();
    await expect(within(document.body).getByText("Running")).toBeInTheDocument();
  },
};

export const WithAncestors: Story = {
  args: {
    categories: categoriesWithAncestors,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act
    await userEvent.click(categoryCombobox);

    // Assert
    const body = within(document.body);

    await expect(await body.findByText("Shoes")).toBeInTheDocument();
    await expect(body.getByText("Shoes /")).toBeInTheDocument();
    await expect(body.getByText("Shoes / ... / Trekking /")).toBeInTheDocument();
  },
};

export const SearchTriggersOnType: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act — focus then type
    await userEvent.click(categoryCombobox);
    await userEvent.type(categoryCombobox, "sneak");

    // Assert — fetchCategories should be called with the typed text
    await expect(args.fetchCategories).toHaveBeenCalledWith("sneak");
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    data: { category: "1", collections: [] },
    categoryInputDisplayValue: "Shoes",
  },
};

export const Empty: Story = {
  args: {
    categories: [],
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act
    await userEvent.click(categoryCombobox);

    // Assert — no category options visible
    const body = within(document.body);
    const shoes = body.queryByText("Shoes");

    await expect(shoes).not.toBeInTheDocument();
  },
};

export const WithSelectedCategory: Story = {
  args: {
    data: { category: "1", collections: [] },
    categoryInputDisplayValue: "Shoes",
  },
};
