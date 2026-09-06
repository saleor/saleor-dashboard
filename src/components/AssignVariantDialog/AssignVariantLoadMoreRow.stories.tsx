import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell } from "@dashboard/components/Table/Table";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import { type SearchProductVariantFragment } from "@dashboard/graphql";
import { type AssignableSearchProduct } from "@dashboard/searches/mapSearchProductsForVariantAssign";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { AssignVariantLoadMoreRow } from "./AssignVariantLoadMoreRow";

const createVariant = (id: string): SearchProductVariantFragment => ({
  __typename: "ProductVariant",
  id,
  name: id,
  sku: id,
  product: {
    __typename: "Product",
    id: "product-1",
    name: "Hoodie",
    thumbnail: null,
    productType: {
      __typename: "ProductType",
      id: "type-1",
      name: "Apparel",
    },
  },
  channelListings: [],
});

const product: AssignableSearchProduct = {
  __typename: "Product",
  id: "product-1",
  name: "Hoodie",
  thumbnail: null,
  productType: {
    __typename: "ProductType",
    id: "type-1",
    name: "Apparel",
  },
  category: null,
  channelListings: [],
  collections: [],
  variants: [createVariant("v1"), createVariant("v2"), createVariant("v3")],
  variantsTotalCount: 42,
  variantsHasNextPage: true,
  variantsEndCursor: "cursor",
};

const meta: Meta<typeof AssignVariantLoadMoreRow> = {
  title: "Components/AssignVariantLoadMoreRow",
  component: AssignVariantLoadMoreRow,
  render: (args: ComponentProps<typeof AssignVariantLoadMoreRow>) => (
    <ResponsiveTable bleed>
      <TableBody>
        <TableRowLink>
          <TableCell />
          <TableCell colSpan={3}>Hoodie / v3</TableCell>
        </TableRowLink>
        <AssignVariantLoadMoreRow {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: {
    product,
    loading: false,
    loadingProduct: false,
    onLoadMore: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignVariantLoadMoreRow>;

export const Default: Story = {};

/** Fetching this product's next variant page — throbber replaces the label. */
export const LoadingProduct: Story = {
  args: { loadingProduct: true },
};

/** Total unknown (the connection returned no totalCount), so no progress line. */
export const WithoutProgress: Story = {
  args: { product: { ...product, variantsTotalCount: null } },
};

/** Nothing left to load — the row removes itself. */
export const NotTruncated: Story = {
  args: { product: { ...product, variantsHasNextPage: false } },
};
