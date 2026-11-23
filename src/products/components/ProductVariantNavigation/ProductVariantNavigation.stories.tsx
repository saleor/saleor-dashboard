import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import placeholderImage from "@assets/images/placeholder60x60.png";
import { PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY } from "@dashboard/config";
import {
  ProductVariantSiblingsDocument,
  type ProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { variantSiblings } from "@dashboard/products/fixtures";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { ProductVariantNavigation } from "./ProductVariantNavigation";

const productId = "product-1";
const siblings = variantSiblings(placeholderImage);

/** A search term that matches none of the variants. */
const noMatchSearch = "zzz";

const siblingsMock = (
  nodes: typeof siblings,
  search?: string,
): MockedResponse<ProductVariantSiblingsQuery> => {
  const data: ProductVariantSiblingsQuery = {
    __typename: "Query",
    product: {
      __typename: "Product",
      id: productId,
      productVariants: {
        __typename: "ProductVariantCountableConnection",
        totalCount: nodes.length,
        pageInfo: {
          __typename: "PageInfo",
          hasNextPage: false,
          hasPreviousPage: false,
          endCursor: null,
        },
        edges: nodes.map(node => ({ __typename: "ProductVariantCountableEdge", node })),
      },
    },
  };

  return {
    request: {
      query: ProductVariantSiblingsDocument,
      variables: {
        id: productId,
        first: PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY,
        ...(search ? { search } : {}),
        ...allPermissions,
      },
    },
    result: { data },
    // Answers every request, so a story that re-renders keeps its list.
    newData: () => ({ data }),
  };
};

const meta: Meta<typeof ProductVariantNavigation> = {
  title: "Products/ProductVariantNavigation",
  component: ProductVariantNavigation,
  decorators: [
    (Story: StoryFn) => (
      <MockedProvider mocks={[siblingsMock(siblings), siblingsMock([], noMatchSearch)]}>
        <Story />
      </MockedProvider>
    ),
  ],
  args: {
    productId,
    fallbackThumbnail: placeholderImage,
    defaultVariantId: siblings[0]?.id,
    current: siblings[1]?.id,
    currentVariant: siblings[1] ?? null,
    isCreate: false,
    onReorder: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductVariantNavigation>;

/** Beside the form on wide screens: the whole list, always in view. */
export const Columns: Story = {
  args: { layout: "columns" },
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="360px">
        <Story />
      </Box>
    ),
  ],
};

export const ColumnsCreateMode: Story = {
  ...Columns,
  args: {
    layout: "columns",
    isCreate: true,
    current: undefined,
    currentVariant: null,
  },
};

/** Above the form on narrow screens: one row, until the merchant asks for the list. */
export const Stacked: Story = {
  args: { layout: "stacked" },
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="390px" padding={4}>
        <Story />
      </Box>
    ),
  ],
};

export const StackedListOpen: Story = {
  ...Stacked,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(await canvas.findByRole("button", { name: /Extended Soft/ }));

    // Assert
    await expect(await canvas.findByPlaceholderText("Search variants")).toBeInTheDocument();
    await expect(canvas.getByText("Normal Hard")).toBeInTheDocument();
  },
};

export const StackedNoMatches: Story = {
  ...Stacked,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole("button", { name: /Extended Soft/ }));

    // Act
    await userEvent.type(await canvas.findByPlaceholderText("Search variants"), noMatchSearch);

    // Assert
    await expect(await canvas.findByText("No variants match your search")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  },
};

export const StackedSelectionPending: Story = {
  ...Stacked,
  args: { layout: "stacked", selectionPending: true },
};

export const StackedCreateMode: Story = {
  ...Stacked,
  args: {
    layout: "stacked",
    isCreate: true,
    current: undefined,
    currentVariant: null,
  },
};
