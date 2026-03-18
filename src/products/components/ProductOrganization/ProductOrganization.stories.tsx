import { getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ComponentType } from "react";
import { useCallback, useState } from "react";
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

const allCategories = getChoicesWithAncestors([
  {
    id: "acc-1",
    name: "Accessories",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "hoo-1",
    name: "Hoodies",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "sho-1",
    name: "Shoes",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
  },
  {
    id: "run-1",
    name: "Running",
    ancestors: { edges: [] },
    parent: null,
    level: 0,
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

/**
 * Simulates the full dynamic search flow: user has a selected category,
 * types to search, and the options list updates asynchronously (as from a
 * server response). Verifies:
 * - Input text is preserved when options update (not reset to selected value)
 * - New server results appear in the dropdown
 */
const DynamicSearchWrapper = (props: Props) => {
  const [dynamicCategories, setDynamicCategories] = useState(allCategories);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback((query: string) => {
    setLoading(true);

    // Simulate async server response
    setTimeout(() => {
      if (query) {
        const filtered = allCategories.filter(c =>
          c.label.toLowerCase().includes(query.toLowerCase()),
        );

        setDynamicCategories(filtered);
      } else {
        setDynamicCategories(allCategories);
      }

      setLoading(false);
    }, 100);
  }, []);

  return (
    <ProductOrganization
      {...props}
      categories={dynamicCategories}
      fetchCategories={fetchCategories}
      fetchMoreCategories={{ hasMore: false, loading, onFetchMore: fn() }}
    />
  );
};

export const DynamicSearchWithSelectedCategory: Story = {
  args: {
    data: { category: "acc-1", collections: [] },
    categoryInputDisplayValue: "Accessories",
  },
  render: (args: Props) => <DynamicSearchWrapper {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act — click to focus, then clear and type search term
    await userEvent.click(categoryCombobox);
    await userEvent.clear(categoryCombobox);
    await userEvent.type(categoryCombobox, "hoo");

    // Assert — "Hoodies" should appear in filtered results after async fetch
    await expect(await within(document.body).findByText("Hoodies")).toBeInTheDocument();

    // Assert — input should show typed text, not reset to "Accessories"
    await expect(categoryCombobox).toHaveValue("hoo");
  },
};

export const DynamicSearchOptionsUpdate: Story = {
  render: (args: Props) => <DynamicSearchWrapper {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const categoryCombobox = canvas.getAllByRole("combobox")[0];

    // Act — type to trigger search
    await userEvent.click(categoryCombobox);
    await userEvent.type(categoryCombobox, "run");

    // Assert — after async update, "Running" should be visible
    await expect(await within(document.body).findByText("Running")).toBeInTheDocument();

    // Assert — input text should still be what we typed
    await expect(categoryCombobox).toHaveValue("run");
  },
};
